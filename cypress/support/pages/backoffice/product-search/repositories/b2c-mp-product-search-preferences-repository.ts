import { injectable } from 'inversify';
import { ProductSearchPreferencesRepository } from '../product-search-preferences-repository';

@injectable()
export class B2cMpProductSearchPreferencesRepository implements ProductSearchPreferencesRepository {
  // Filter preferences
  getFilterListContainer(): Cypress.Chainable {
    return cy.get('.dt-container');
  }

  getFilterKeyInput(): Cypress.Chainable {
    return cy.get('#attributeForm_key');
  }

  getFilterTypeSelect(): Cypress.Chainable {
    return cy.get('#attributeForm_filter_type');
  }

  getFilterNameTranslationInput(): Cypress.Chainable {
    return cy.get('.name-translation');
  }

  getCopyTranslationButton(): Cypress.Chainable {
    return cy.get('.name-translation ~ span > button');
  }

  getFilterFormSubmit(): Cypress.Chainable {
    return cy.get('#attributeForm_submit');
  }

  getFilterEditButton(): Cypress.Chainable {
    return cy.get('[data-qa="title-action"] > .btn-edit');
  }

  getFilterDeleteButton(): Cypress.Chainable {
    return cy.get('form[name="delete_filter_preferences_form"] button');
  }

  getSyncFiltersButton(): Cypress.Chainable {
    return cy.get('#syncFilters');
  }

  getSaveFilterOrderButton(): Cypress.Chainable {
    return cy.get('#save-filter-order');
  }

  getFilterOrderSaveAlert(): Cypress.Chainable {
    return cy.get('.swal2-title');
  }

  getFilterDeletedMessage(): string {
    return 'Filter successfully deleted.';
  }

  getFilterSyncSuccessMessage(): string {
    return 'Filter preferences synchronization was successful.';
  }

  // Search preferences
  getSearchPreferencesListContainer(): Cypress.Chainable {
    return cy.get('.dt-container');
  }

  getSearchKeyInput(): Cypress.Chainable {
    return cy.get('#searchPreferences_key');
  }

  getSearchFullTextSelect(): Cypress.Chainable {
    return cy.get('#searchPreferences_fullText');
  }

  getSearchFullTextBoostedSelect(): Cypress.Chainable {
    return cy.get('#searchPreferences_fullTextBoosted');
  }

  getSearchSuggestionTermsSelect(): Cypress.Chainable {
    return cy.get('#searchPreferences_suggestionTerms');
  }

  getSearchCompletionTermsSelect(): Cypress.Chainable {
    return cy.get('#searchPreferences_completionTerms');
  }

  getSearchFormSubmit(): Cypress.Chainable {
    return cy.get('#searchPreferences_submit');
  }

  getSearchTableSearchInput(): Cypress.Chainable {
    return cy.get('input#dt-search-0');
  }

  getSearchTableFirstCell(): Cypress.Chainable {
    return cy.get('.dataTable tbody tr:first-child td:first-child');
  }

  getSearchFirstRowUpdateButton(): Cypress.Chainable {
    return cy.get('.dataTable tbody tr:first-child td:last-child .btn-edit');
  }

  getSearchFirstRowDeleteButton(): Cypress.Chainable {
    return cy.get('.dataTable tbody tr:first-child td:last-child .btn-danger');
  }

  getSyncSearchPreferencesButton(): Cypress.Chainable {
    return cy.get('#syncSearchPreferences');
  }

  getAttributeAddedMessage(): string {
    return 'Attribute to search was added successfully.';
  }

  getAttributeUpdatedMessage(): string {
    return 'Attribute to search was successfully updated.';
  }

  getAttributeDeactivatedMessage(): string {
    return 'Attribute to search was successfully deactivated.';
  }

  getSearchSyncSuccessMessage(): string {
    return 'Search preferences synchronization was successful.';
  }
}
