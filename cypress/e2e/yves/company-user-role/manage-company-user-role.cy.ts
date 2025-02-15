import { container } from '@utils';
import { LoginPage, ManageCompanyRoleUserPage } from '@pages/yves';
import { CompanyUserRoleDynamicFixtures, CompanyUserRoleStaticFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe('manage company user', { tags: ['@yves', '@customer-account-management'] }, (): void => {
  const loginPage = container.get(LoginPage);
  const manageCompanyRoleUserPage = container.get(ManageCompanyRoleUserPage);

  let dynamicFixtures: CompanyUserRoleDynamicFixtures;
  let staticFixtures: CompanyUserRoleStaticFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });

    manageCompanyRoleUserPage.visit({}, dynamicFixtures.companyRole.id_company_role);
  });

  skipB2CIt((): void => {
    manageCompanyRoleUserPage.unassignUser();
    manageCompanyRoleUserPage.assignUser();
    manageCompanyRoleUserPage.assertTopRowHasAssignButton();
  });

  skipB2CIt((): void => {
    requestUnassignUrl.then(() => {
      cy.url().should('include', 'error-page/403');
    });
  });

  function skipB2CIt(testFn: () => void): void {
    (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)('', testFn);
  }
});
