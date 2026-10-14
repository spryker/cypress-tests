export interface CompanyUserSelectRepository {
  getBusinessUnitSelect(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getBusinessUnitOptions(): Cypress.Chainable;
  getActiveBusinessUnit(): Cypress.Chainable;
}
