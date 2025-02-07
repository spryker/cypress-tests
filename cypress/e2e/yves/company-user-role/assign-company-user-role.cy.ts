import { container } from '@utils';
import { LoginPage, CompanyUserManagePage } from '@pages/yves';
import { CompanyRoleDynamicFixtures, CompanyRoleStaticFixtures } from '@interfaces/yves';

describe('manage company user', { tags: ['@yves', '@customer-account-management'] }, (): void => {
  const loginPage = container.get(LoginPage);
  const companyUserManagePage = container.get(CompanyUserManagePage);

  let dynamicFixtures: CompanyRoleDynamicFixtures;
  let staticFixtures: CompanyRoleStaticFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());

      loginPage.visit();
      loginPage.login({
          email: dynamicFixtures.customer.email,
          password: staticFixtures.defaultPassword }
      );

      cy.visit('/DE/en/company/company-role/user/manage?id=' + dynamicFixtures.companyRole.id_company_role);
  });
    it('customer should be able to assign a user to a company role', (): void => {

        cy.get('body').find('.role-user-table tr:first-child a:contains("Unassign")').click();

        cy.get('body').find('.role-user-table tr:first-child a:contains("Assign")').click();

        cy.get('body').find('.role-user-table tr:first-child').should('contains.text', 'Unassign');
    });

    it('customer should be unable to unassign a company role without a CSRF token', (): void => {
        cy.visit('/DE/en/company/company-role/user/unassign??id-company-user=' + dynamicFixtures.companyRole.id_company_role +'&id-company-role=' + dynamicFixtures.companyRole.id_company_role + '&_token=BAD_TOKEN');
        cy.url().should('include', 'error-page/403')
    });

  function skipB2BIt(description: string, testFn: () => void): void {
    (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
  }
});
