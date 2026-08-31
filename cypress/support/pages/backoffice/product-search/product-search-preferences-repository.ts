export interface ProductSearchPreferencesRepository {
  // Filter preferences
  getFilterListContainer(): Cypress.Chainable;
  getFilterKeyInput(): Cypress.Chainable;
  getFilterTypeSelect(): Cypress.Chainable;
  getFilterNameTranslationInput(): Cypress.Chainable;
  getCopyTranslationButton(): Cypress.Chainable;
  getFilterFormSubmit(): Cypress.Chainable;
  getFilterEditButton(): Cypress.Chainable;
  getFilterDeleteButton(): Cypress.Chainable;
  getFilterDeletedMessage(): string;

  // Filter reorder — the nestable list on /product-search/filter-reorder
  getFilterReorderListSelector(): string;
  getFilterItemSelector(idProductSearchAttribute: string): string;
  getFilterPrecedingSibling(idBefore: string, idAfter: string): Cypress.Chainable;
  getSaveFilterOrderButton(): Cypress.Chainable;
  getFilterOrderSaveAlert(): Cypress.Chainable;

  // Search preferences
  getSearchPreferencesListContainer(): Cypress.Chainable;
}
