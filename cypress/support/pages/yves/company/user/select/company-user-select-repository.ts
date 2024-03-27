export interface CompanyUserSelectRepository {
  getBusinessUnitSelect(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
}
