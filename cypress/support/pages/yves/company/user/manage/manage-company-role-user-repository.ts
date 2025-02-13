export interface ManageCompanyRoleUserRepository {
  getFirstUserUnassignButton(): Cypress.Chainable;
  getFirstUserAssignButton(): Cypress.Chainable;
}
