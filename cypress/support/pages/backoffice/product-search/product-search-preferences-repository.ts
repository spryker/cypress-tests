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
  getSyncFiltersButton(): Cypress.Chainable;
  getSaveFilterOrderButton(): Cypress.Chainable;
  getFilterOrderSaveAlert(): Cypress.Chainable;
  getFilterDeletedMessage(): string;
  getFilterSyncSuccessMessage(): string;

  // Search preferences
  getSearchPreferencesListContainer(): Cypress.Chainable;
  getSearchKeyInput(): Cypress.Chainable;
  getSearchFullTextSelect(): Cypress.Chainable;
  getSearchFullTextBoostedSelect(): Cypress.Chainable;
  getSearchSuggestionTermsSelect(): Cypress.Chainable;
  getSearchCompletionTermsSelect(): Cypress.Chainable;
  getSearchFormSubmit(): Cypress.Chainable;
  getSearchTableSearchInput(): Cypress.Chainable;
  getSearchTableFirstCell(): Cypress.Chainable;
  getSearchFirstRowUpdateButton(): Cypress.Chainable;
  getSearchFirstRowDeleteButton(): Cypress.Chainable;
  getSyncSearchPreferencesButton(): Cypress.Chainable;
  getAttributeAddedMessage(): string;
  getAttributeUpdatedMessage(): string;
  getAttributeDeactivatedMessage(): string;
  getSearchSyncSuccessMessage(): string;
}
