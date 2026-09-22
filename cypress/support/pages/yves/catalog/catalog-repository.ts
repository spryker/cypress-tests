export interface CatalogRepository {
  getSearchInput(): Cypress.Chainable;
  getFirstSuggestedProduct(): Cypress.Chainable;

  // The suggestion dropdown's product entries, as a selector so a spec can assert their absence —
  // a restricted product is simply not offered, so there is nothing to query for.
  getSuggestedProductSelector(): string;
  getSearchButton(): Cypress.Chainable;
  getProductItemBlocks(): Cypress.Chainable;
  getFirstProductItemBlockSelector(): string;
  getProductItemBlockSelector(): string;
  getViewButtonSelector(): string;
  getItemBlockSearchQuery(query: string): string;

  // A card prints the default price always and the original price only when one is set above it, so
  // the two need distinct selectors — the classes are the same in every storefront theme.
  getProductItemDefaultPriceSelector(): string;
  getProductItemOriginalPriceSelector(): string;

  // The "N items found" counter. This is the one catalog selector the themes genuinely disagree on.
  getFoundItemsCounterSelector(): string;

  // Facet headings, and the checkbox a facet value is applied through. The checkbox name and value
  // come from the search request builder rather than from the theme, so they are shared.
  getFilterTitlesSelector(): string;
  getFilterValueCheckboxSelector(filterName: string, filterValue: string): string;
  getApplyFiltersButtonSelector(): string;
  getSortSelectSelector(): string;
  getPaginationStepSelector(): string;

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
