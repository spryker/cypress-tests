export interface CatalogRepository {
  getSearchInput(): Cypress.Chainable;
  getFirstSuggestedProduct(): Cypress.Chainable;
  getSearchButton(): Cypress.Chainable;
  getProductItemBlocks(): Cypress.Chainable;
  getFirstProductItemBlockSelector(): string;
  getViewButtonSelector(): string;
}
