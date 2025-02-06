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
  });
    it('customer should be able to assign a user to a company role', (): void => {
        loginPage.visit();
        loginPage.login({
            email: dynamicFixtures.customer.email,
            password: staticFixtures.defaultPassword }
        );

        // 0. Dyna fixtures must run and create 2 company users and perms

        cy.visit('/company/user/manage?id=1');

        // companyUserManagePage.visit({'id': 1});
        // companyUserManagePage.assignRole();
        // companyUserManagePage.successMessageExists();
    });

    // it('customer should be unable to assign a company role without a CSRF token', (): void => {
    //     loginPage.visit();
    //     loginPage.login({ email: dynamicFixtures.customer.email, password: staticFixtures.defaultPassword });
    //
    //     customerOverviewPage.assertPageLocation();
    // });

  function skipB2BIt(description: string, testFn: () => void): void {
    (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
  }
});
