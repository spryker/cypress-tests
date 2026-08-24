import { container } from '@utils';
import { CompanyStructureCreationDynamicFixtures, CompanyStructureCreationStaticFixtures } from '@interfaces/yves';
import { CompanyBusinessUnitCreatePage, CompanyUserCreatePage } from '@pages/yves';
import { CustomerLoginScenario, ImpersonateCustomerScenario } from '@scenarios/yves';

describe(
  'company structure creation',
  {
    tags: ['@yves', '@company-account', 'company-account', 'customer-account-management', 'spryker-core', 'acl'],
  },
  (): void => {
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because company accounts exist only in suite, b2b and b2b-mp', () => {});
      return;
    }

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const impersonateCustomerScenario = container.get(ImpersonateCustomerScenario);
    const companyBusinessUnitCreatePage = container.get(CompanyBusinessUnitCreatePage);
    const companyUserCreatePage = container.get(CompanyUserCreatePage);

    let staticFixtures: CompanyStructureCreationStaticFixtures;
    let dynamicFixtures: CompanyStructureCreationDynamicFixtures;

    let businessUnitName: string;
    let newCompanyUserEmail: string;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());

      const unique = Date.now();
      businessUnitName = `BusinessUnit${unique}`;
      newCompanyUserEmail = `company.user.${unique}@spryker.local`;
    });

    it('company administrator should be able to create a business unit and a company user in it', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.adminCustomer.email,
        password: staticFixtures.defaultPassword,
      });

      // Act
      companyBusinessUnitCreatePage.visit();
      companyBusinessUnitCreatePage.create({
        name: businessUnitName,
        email: `business.unit.${businessUnitName}@spryker.local`,
      });

      companyUserCreatePage.visit();
      companyUserCreatePage.create({
        businessUnitName: businessUnitName,
        roleName: staticFixtures.restrictedRoleName,
        email: newCompanyUserEmail,
        firstName: 'Company',
        lastName: 'User',
      });

      // Assert
      // The users table lists name, business unit and role but never the email, so the run-unique
      // business unit name is what identifies the row this test created.
      companyUserCreatePage.getUserRow(businessUnitName).should('contain.text', staticFixtures.restrictedRoleName);
    });

    it('created company user should reach only what its role allows', (): void => {
      // Arrange
      // Nothing knows the new company user's password, so the agent switches into their session.
      impersonateCustomerScenario.execute({
        agentUsername: dynamicFixtures.agentUser.username,
        agentPassword: staticFixtures.defaultPassword,
        customerEmail: newCompanyUserEmail,
      });

      // Act
      cy.visit(staticFixtures.companyUserPagePath, { failOnStatusCode: false });

      // Assert
      cy.url().should('include', staticFixtures.companyUserPagePath);

      // Act
      cy.visit(staticFixtures.companyRolePagePath, { failOnStatusCode: false });

      // Assert
      cy.url().should('include', '403');
    });
  }
);
