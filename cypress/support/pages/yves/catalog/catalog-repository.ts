export interface CatalogRepository {
  getSearchInput(): Cypress.Chainable;
  getFirstSuggestedProduct(): Cypress.Chainable;
  getSearchButton(): Cypress.Chainable;
  getProductItemBlocks(): Cypress.Chainable;
  getFirstProductItemBlockSelector(): string;
  getViewButtonSelector(): string;
  getItemBlockSearchQuery(query: string): string;

  // A card prints the default price always and the original price only when one is set above it, so
  // the two need distinct selectors — the classes are the same in every storefront theme.
  getProductItemDefaultPriceSelector(): string;
  getProductItemOriginalPriceSelector(): string;
  getSspAssetSelectorBlock(): Cypress.Chainable;
  getSspAssetNameBlock(): Cypress.Chainable;
  getSspAssetSelectorTriggerButton(): Cypress.Chainable;
  getSspAssetOption(reference: string): Cypress.Chainable;
  getSspAssetOptionTriggerButtonSelector(): string;
}
