export interface CatalogRepository {
  getSearchInput(): Cypress.Chainable;
  getFirstSuggestedProduct(): Cypress.Chainable;
  getSearchButton(): Cypress.Chainable;
  getProductItemBlocks(): Cypress.Chainable;
  getFirstProductItemBlockSelector(): string;
  getViewButtonSelector(): string;
  getItemBlockSearchQuery(query: string): string;
  getSspAssetSelectorBlock(): Cypress.Chainable;
  getSspAssetNameBlock(): Cypress.Chainable;
  getSspAssetSelectorTriggerButton(): Cypress.Chainable;
  getSspAssetOption(reference: string): Cypress.Chainable;
  getSspAssetOptionTriggerButtonSelector(): string;
}
