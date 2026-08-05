export interface ProductOptionRepository {
  getGroupNameInput(): Cypress.Chainable;
  getTaxSetSelect(): Cypress.Chainable;
  getGroupNameTranslationInput(index: number): Cypress.Chainable;
  getTranslationCopyButton(): Cypress.Chainable;
  getCollapsedTranslationBlockToggle(): Cypress.Chainable;
  getOptionValueInput(elementNr: number): Cypress.Chainable;
  getOptionValueSkuInput(elementNr: number): Cypress.Chainable;
  getOptionValueNetAmountInput(elementNr: number, currencyIndex: number): Cypress.Chainable;
  getOptionValueGrossAmountInput(elementNr: number, currencyIndex: number): Cypress.Chainable;
  getAddAnotherOptionButton(): Cypress.Chainable;
  getOptionValueTranslationInput(index: number): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getTopbar(): Cypress.Chainable;
  getProductTab(): Cypress.Chainable;
  getDataTableProcessing(): Cypress.Chainable;
  getProductTableRowCell(rowNumber: number): Cypress.Chainable;
  getAllProductsCheckbox(idProduct: string): Cypress.Chainable;
  getProductsToBeAssignedTab(): Cypress.Chainable;
  getSelectedProductRowCell(): Cypress.Chainable;
  getUnassignProductLink(idProduct: string): Cypress.Chainable;
  getCreateBreadcrumb(): string;
  getProductCreatedSuccessMessage(): string;
}
