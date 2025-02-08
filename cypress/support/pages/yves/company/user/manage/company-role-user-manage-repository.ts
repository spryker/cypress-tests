export interface CompanyRoleUserManageRepository {
    getFirstUserUnassignButton(): Cypress.Chainable;
    getFirstUserAssignButton(): Cypress.Chainable;
}
