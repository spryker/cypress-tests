export interface CatalogRepository {
  getSearchInput(): Cypress.Chainable;
  getFirstSuggestedProduct(): Cypress.Chainable;
}
