import { container } from '@utils';
import { LoginPage, CompanyRoleUserManagePage } from '@pages/yves';
import { CompanyUserRoleDynamicFixtures, CompanyUserRoleStaticFixtures } from '@interfaces/yves';

describe('manage company user', { tags: ['@yves', '@customer-account-management'] }, (): void => {
  const loginPage = container.get(LoginPage);
  const companyRoleUserManagePage = container.get(CompanyRoleUserManagePage);

  let dynamicFixtures: CompanyUserRoleDynamicFixtures;
  let staticFixtures: CompanyUserRoleStaticFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());

    loginPage.visit();
    loginPage.login({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    companyRoleUserManagePage.visit({}, dynamicFixtures.companyRole.id_company_role);
  });

  skipB2CIt('customer should be able to assign a user to a company role', (): void => {
    companyRoleUserManagePage.unassignUser();
    companyRoleUserManagePage.assignUser();
    companyRoleUserManagePage.assertTopRowHasAssignButton();
  });

  skipB2CIt('customer should be unable to unassign a company role without a CSRF token', (): void => {
    cy.visit(
      '/company/company-role/user/unassign??id-company-user=' +
        dynamicFixtures.companyRole.id_company_role +
        '&id-company-role=' +
        dynamicFixtures.companyRole.id_company_role +
        '&_token=BAD_TOKEN'
    );
    cy.url().should('include', 'error-page/403');
  });

  function skipB2CIt(description: string, testFn: () => void): void {
    (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
  }
});
