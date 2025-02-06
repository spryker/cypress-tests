import { container } from '@utils';
import { CompanyRoleCreateStaticFixtures } from '@interfaces/backoffice';
import { CompanyRoleListPage, CompanyRoleCreatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('company role create', { tags: ['@backoffice', '@company-role'] }, (): void => {
  const companyRoleListPage = container.get(CompanyRoleListPage);
  const companyRoleCreatePage = container.get(CompanyRoleCreatePage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: CompanyRoleCreateStaticFixtures;

  before((): void => {
    staticFixtures = Cypress.env('staticFixtures');
  });

  beforeEach((): void => {
    userLoginScenario.execute({
      username: staticFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('should be able to access company role create page', (): void => {
    companyRoleListPage.visit();
    companyRoleListPage.clickAddCompanyUserRoleButton();
    companyRoleCreatePage.assertPageLocation();
    cy.get('body').contains('Create role');
  });
});
