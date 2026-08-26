export interface CompanyUserSelectRepository {
  getBusinessUnitSelect(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getBusinessUnitOptions(): Cypress.Chainable;
  getActiveBusinessUnitLink(): Cypress.Chainable;
}
