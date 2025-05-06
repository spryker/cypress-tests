export interface MultiCartRepository {
  getCreateCartNameInput(): Cypress.Chainable;
  getCreateCartForm(): Cypress.Chainable;
  getQuoteTable(): Cypress.Chainable;
  getMiniCartRadios(): Cypress.Chainable;
}
