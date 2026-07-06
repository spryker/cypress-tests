import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductSearchPreferencesRepository } from './product-search-preferences-repository';

@injectable()
@autoWired
export class ProductSearchPreferencesPage extends BackofficePage {
  @inject(REPOSITORIES.ProductSearchPreferencesRepository)
  private repository: ProductSearchPreferencesRepository;

  protected PAGE_URL = '/product-search/filter-preferences';

  private FILTER_LIST_URL = '/product-search/filter-preferences';

  private FILTER_CREATE_URL = '/product-search/filter-preferences/create';

  private FILTER_VIEW_URL = '/product-search/filter-preferences/view?id=';

  private FILTER_REORDER_URL = '/product-search/filter-reorder';

  private SEARCH_LIST_URL = '/product-search/search-preferences';

  private SEARCH_CREATE_URL = '/product-search/search-preferences/create';

  // --- Filter preferences ---------------------------------------------------

  visitFilterList = (): void => {
    cy.visitBackoffice(this.FILTER_LIST_URL);
  };

  assertFilterListVisible = (): void => {
    this.repository.getFilterListContainer().should('be.visible');
  };

  // Mirrors ProductSearchPresentationTester::createFilter — fills the create form,
  // copies the name translation to all locales, submits, and returns the new
  // filter id parsed from the resulting view URL.
  createFilter = (filterName: string): Cypress.Chainable<string> => {
    cy.visitBackoffice(this.FILTER_CREATE_URL);

    this.repository.getFilterKeyInput().clear().type(filterName);
    this.repository.getFilterTypeSelect().select('multi-select');
    this.repository.getFilterNameTranslationInput().first().clear().type(`${filterName} name`);
    this.repository.getCopyTranslationButton().click();
    this.repository.getFilterFormSubmit().click();

    return cy
      .url()
      .should('match', /\/product-search\/filter-preferences\/view\?id=\d+/)
      .then((url: string) => (url.match(/id=(\d+)/) as RegExpMatchArray)[1]);
  };

  // Mirrors ProductSearchPresentationTester::updateFilter — switches the filter
  // type to single-select and saves.
  updateFilter = (id: string): void => {
    cy.visitBackoffice(`${this.FILTER_VIEW_URL}${id}`);
    this.repository.getFilterEditButton().click();

    cy.url().should('match', /\/product-search\/filter-preferences\/edit\?id=\d+/);

    this.repository.getFilterTypeSelect().select('single-select');
    this.repository.getFilterFormSubmit().click();

    cy.url().should('match', /\/product-search\/filter-preferences\/view\?id=\d+/);
  };

  // Mirrors ProductSearchPresentationTester::deleteFilter.
  deleteFilter = (id: string): void => {
    cy.visitBackoffice(`${this.FILTER_VIEW_URL}${id}`);
    this.repository.getFilterDeleteButton().click();

    cy.url().should('include', this.FILTER_LIST_URL);
    cy.contains(this.repository.getFilterDeletedMessage()).should('be.visible');
  };

  visitFilterReorder = (): void => {
    cy.visitBackoffice(this.FILTER_REORDER_URL);
  };

  synchronizeFilters = (): void => {
    this.repository.getSyncFiltersButton().click();

    cy.url().should('include', this.FILTER_LIST_URL);

    // The controller enqueues the sync event; drain the queue so the sync is
    // actually processed rather than waiting a fixed interval.
    cy.runQueueWorker();

    cy.contains(this.repository.getFilterSyncSuccessMessage()).should('be.visible');
  };

  // --- Search preferences ---------------------------------------------------

  visitSearchList = (): void => {
    cy.visitBackoffice(this.SEARCH_LIST_URL);
  };

  assertSearchPreferencesListVisible = (): void => {
    this.repository.getSearchPreferencesListContainer().should('be.visible');
  };

  // Mirrors ProductSearchPresentationTester::addAttributeToSearch.
  addAttributeToSearch = (attributeKey: string): void => {
    cy.visitBackoffice(this.SEARCH_CREATE_URL);

    this.repository.getSearchKeyInput().clear().type(attributeKey);
    this.repository.getSearchFullTextSelect().select('yes');
    this.repository.getSearchSuggestionTermsSelect().select('yes');
    this.repository.getSearchCompletionTermsSelect().select('yes');

    this.repository.getSearchFormSubmit().click();

    cy.url().should('include', this.SEARCH_LIST_URL);
    cy.contains(this.repository.getAttributeAddedMessage()).should('be.visible');
  };

  // Mirrors ProductSearchPresentationTester::updateAttributeToSearch.
  updateAttributeToSearch = (attributeKey: string): void => {
    this.searchTableByAttributeKey(attributeKey);

    this.repository.getSearchFirstRowUpdateButton().click();

    cy.url().should('match', /\/product-search\/search-preferences\/edit\?id=\d+/);

    this.repository.getSearchFullTextSelect().select('no');
    this.repository.getSearchFullTextBoostedSelect().select('yes');

    this.repository.getSearchFormSubmit().click();

    cy.url().should('include', this.SEARCH_LIST_URL);
    cy.contains(this.repository.getAttributeUpdatedMessage()).should('be.visible');
  };

  // Mirrors ProductSearchPresentationTester::deactivateAttributeToSearch.
  deactivateAttributeToSearch = (attributeKey: string): void => {
    this.searchTableByAttributeKey(attributeKey);

    this.repository.getSearchFirstRowDeleteButton().click();

    cy.url().should('include', this.SEARCH_LIST_URL);
    cy.contains(this.repository.getAttributeDeactivatedMessage()).should('be.visible');
  };

  synchronizeSearchPreferences = (): void => {
    this.repository.getSyncSearchPreferencesButton().click();

    cy.url().should('include', this.SEARCH_LIST_URL);

    // Drain the queue so the enqueued sync event is processed before asserting.
    cy.runQueueWorker();

    cy.contains(this.repository.getSearchSyncSuccessMessage()).should('be.visible');
  };

  // Mirrors ProductSearchPresentationTester::searchTableByAttributeKey.
  private searchTableByAttributeKey(attributeKey: string): void {
    cy.visitBackoffice(this.SEARCH_LIST_URL);
    this.repository.getSearchTableSearchInput().clear().type(attributeKey);
    this.repository.getSearchTableFirstCell().should('be.visible');
  }
}
