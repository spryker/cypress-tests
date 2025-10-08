import { container } from '@utils';
import { CompanyRoleDynamicFixtures, CompanyRoleStaticFixtures } from '@interfaces/yves';
import { CompanyRoleIndexPage, CompanyRoleCreatePage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

(['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'company-role',
  { tags: ['@yves', '@company', '@company-role', 'company-account', 'customer-account-management', 'customer-access', 'spryker-core'] },
  (): void => {
    const loginCustomerScenario = container.get(CustomerLoginScenario);
    const companyRoleIndexPage = container.get(CompanyRoleIndexPage);
    const companyRoleCreatePage = container.get(CompanyRoleCreatePage);

    let dynamicFixtures: CompanyRoleDynamicFixtures;
    let staticFixtures: CompanyRoleStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('customer should be access / see company role add page', (): void => {
      loginCustomerScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      companyRoleIndexPage.visit();
      companyRoleIndexPage.clickAddNewRole();
      companyRoleCreatePage.assertPageLocation();
      companyRoleCreatePage.getCompanyRoleForm().should('exist').and('be.visible');
    });
  }
);
