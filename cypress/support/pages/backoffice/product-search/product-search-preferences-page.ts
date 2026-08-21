import { REPOSITORIES, autoWired, dragNestableItem, waitForNestableInit } from '@utils';
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

  // --- Filter preferences ---------------------------------------------------

  visitFilterList = (): void => {
    cy.visitBackoffice(this.FILTER_LIST_URL);
  };

  getFilterList = (): Cypress.Chainable => this.repository.getFilterListContainer();

  // Mirrors ProductSearchPresentationTester::createFilter — fills the create form,
  // copies the name translation to all locales, submits, and returns the new
  // filter id parsed from the resulting view URL.
  createFilter = (filterName: string): Cypress.Chainable<string> => {
    cy.visitBackoffice(this.FILTER_CREATE_URL);

    this.repository.getFilterKeyInput().clear().type(filterName);
    this.repository.getFilterTypeSelect().select('multi-select');
    this.repository.getFilterNameTranslationInput().first().clear().type(`${filterName} name`);
    this.repository.getCopyTranslationButton().first().click();
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

  // --- Filter reorder -------------------------------------------------------

  visitFilterReorder = (): void => {
    cy.visitBackoffice(this.FILTER_REORDER_URL);
    waitForNestableInit();
  };

  // Drags the `idFilter` row into the slot the `idTargetFilter` row occupies. The reorder page is a
  // jQuery-nestable list, the same widget the category re-sort page uses, so it is driven by the
  // shared nestable helper rather than a synthetic pointer-event sequence.
  reorderFilter = (idFilter: string, idTargetFilter: string): void => {
    dragNestableItem({
      listSelector: this.repository.getFilterReorderListSelector(),
      fromItemSelector: this.repository.getFilterItemSelector(idFilter),
      toItemSelector: this.repository.getFilterItemSelector(idTargetFilter),
    });
  };

  getFilterPrecedingSibling = (idBefore: string, idAfter: string): Cypress.Chainable =>
    this.repository.getFilterPrecedingSibling(idBefore, idAfter);

  saveFilterOrder = (): void => {
    this.repository.getSaveFilterOrderButton().click();
  };

  getFilterOrderSaveAlert = (): Cypress.Chainable => this.repository.getFilterOrderSaveAlert();

  // --- Search preferences ---------------------------------------------------

  visitSearchList = (): void => {
    cy.visitBackoffice(this.SEARCH_LIST_URL);
  };

  getSearchPreferencesList = (): Cypress.Chainable => this.repository.getSearchPreferencesListContainer();
}
