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

  // The quick-add button, narrowed to the interactive one: an unbuyable card still renders the
  // button, only disabled, so matching it unconditionally would report an offer that is not there.
  getEnabledAddToCartButtonSelector(): string;

  // Picking a group sibling's colour is a click in some themes and a hover in others, so the
  // interaction belongs with the selector rather than in the page object.
  selectColorSwatch(swatchIdentifier: string): void;
  getSspAssetSelectorBlock(): Cypress.Chainable;
  getSspAssetNameBlock(): Cypress.Chainable;
  getSspAssetSelectorTriggerButton(): Cypress.Chainable;
  getSspAssetOption(reference: string): Cypress.Chainable;
  getSspAssetOptionTriggerButtonSelector(): string;
}
