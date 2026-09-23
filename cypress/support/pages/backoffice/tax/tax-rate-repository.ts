export interface TaxRateRepository {
  getForm(): Cypress.Chainable;
  getNameInput(): Cypress.Chainable;
  getCountrySelect(): Cypress.Chainable;
  getPercentageInput(): Cypress.Chainable;
  getSaveButton(): Cypress.Chainable;
  getListOfTaxRatesButton(): Cypress.Chainable;
  getSuccessAlert(): Cypress.Chainable;
  getListSearchInput(): Cypress.Chainable;
  getSuccessMessagePattern(): RegExp;
  getNameBlankError(): string;
  getCountryBlankError(): string;
  getPercentageRangeError(): string;
  getAlreadyExistsError(): string;
  getEmptyTableMessage(): string;
}
