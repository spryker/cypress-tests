import { container } from '@utils';
import { CompanyRoleCreateStaticFixtures, CompanyRoleCreateDynamicFixtures } from '@interfaces/backoffice';
import { CompanyRoleListPage, CompanyRoleCreatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

(['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'company role create',
  { tags: ['@backoffice', '@company-role', 'company-role', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const companyRoleListPage = container.get(CompanyRoleListPage);
    const companyRoleCreatePage = container.get(CompanyRoleCreatePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: CompanyRoleCreateStaticFixtures;
    let dynamicFixtures: CompanyRoleCreateDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('should be able to access company role create page', (): void => {
      companyRoleListPage.visit();
      companyRoleListPage.clickAddCompanyUserRoleButton();
      companyRoleCreatePage.assertPageLocation();
      companyRoleCreatePage.getCompanyRoleCreateForm().should('exist').and('be.visible');
    });
  }
);
