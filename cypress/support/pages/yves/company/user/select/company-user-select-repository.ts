export interface CompanyUserSelectRepository {
  getBusinessUnitSelect(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getTopUserEnableButton(): Cypress.Chainable;
  getTopUserDisableButton(): Cypress.Chainable;
}
