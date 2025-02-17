import { container } from '@utils';
import { ManageCompanyRoleUserPage } from '@pages/yves';
import { CompanyUserRoleDynamicFixtures, CompanyUserRoleStaticFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe('manage company user', { tags: ['@yves', '@customer-account-management'] }, (): void => {
  const customerLoginScenario = container.get(CustomerLoginScenario);
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

  skipB2CIt('customer should be able to assign a user to a company role', (): void => {
    manageCompanyRoleUserPage.unassignUser();
    manageCompanyRoleUserPage.assignUser();
    manageCompanyRoleUserPage.assertTopRowHasAssignButton();
  });

  skipB2CIt('customer should be unable to unassign a company role without a CSRF token', (): void => {
    manageCompanyRoleUserPage
      .requestUnassignUrl(dynamicFixtures.companyRole.id_company_role, dynamicFixtures.companyUser.id_company_user)
      .then(() => {
        cy.url().should('include', 'error-page/403');
      });
  });

  function skipB2CIt(description: string, testFn: () => void): void {
    (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
  }
});
