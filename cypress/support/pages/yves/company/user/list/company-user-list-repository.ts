export interface CompanyUserListRepository {
  getTopUserEnableButton(): Cypress.Chainable;
  getTopUserDisableButton(): Cypress.Chainable;
}
