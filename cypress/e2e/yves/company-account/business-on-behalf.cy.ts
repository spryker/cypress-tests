import { container } from '@utils';
import { CompanyUserSelectPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { BusinessOnBehalfDynamicFixtures, BusinessOnBehalfStaticFixtures } from '@interfaces/yves';

describe('business on behalf', { tags: ['@yves', '@company-account', 'company-account', 'spryker-core'] }, (): void => {
  // Acting for a business unit only exists on the company-account storefronts.
  if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
    it.skip('skipped because the B2C storefronts have no company accounts', (): void => {});

    return;
  }

  const companyUserSelectPage = container.get(CompanyUserSelectPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let dynamicFixtures: BusinessOnBehalfDynamicFixtures;
  let staticFixtures: BusinessOnBehalfStaticFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('given a customer attached to two business units when they use the selector then they can act for either one', (): void => {
    // Arrange
    // The selector labels every account as "<company> / <business unit>".
    const businessUnitAccounts = [
      {
        label: `${dynamicFixtures.company.name} / ${dynamicFixtures.firstBusinessUnit.name}`,
        idCompanyUser: dynamicFixtures.firstCompanyUser.id_company_user,
      },
      {
        label: `${dynamicFixtures.company.name} / ${dynamicFixtures.secondBusinessUnit.name}`,
        idCompanyUser: dynamicFixtures.secondCompanyUser.id_company_user,
      },
    ];

    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    companyUserSelectPage.visit();

    businessUnitAccounts.forEach(({ label }): void => {
      companyUserSelectPage.getBusinessUnitOptions().should('contain.text', label);
    });

    businessUnitAccounts.forEach(({ label, idCompanyUser }, index): void => {
      const otherLabel = businessUnitAccounts[businessUnitAccounts.length - 1 - index].label;

      // Act
      companyUserSelectPage.visit();
      companyUserSelectPage.selectBusinessUnit({ idCompanyUser: idCompanyUser });

      // Assert
      // Offering both in the dropdown proves nothing on its own; the storefront has to end up
      // acting for the one that was picked and not for its sibling.
      companyUserSelectPage
        .getActiveBusinessUnitLink()
        .should('contain.text', label)
        .and('not.contain.text', otherLabel);
    });
  });
});
