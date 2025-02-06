import { container } from '@utils';
import { CompanyRoleDynamicFixtures, CompanyRoleStaticFixtures } from '@interfaces/yves';
import { CompanyRoleIndexPage, CompanyRoleCreatePage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

(['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'company company-role',
  { tags: ['@yves', '@company', '@company-role'] },
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
