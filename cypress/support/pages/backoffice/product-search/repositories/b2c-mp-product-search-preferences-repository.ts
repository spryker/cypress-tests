import { injectable } from 'inversify';
import { ProductSearchPreferencesRepository } from '../product-search-preferences-repository';

@injectable()
export class B2cMpProductSearchPreferencesRepository implements ProductSearchPreferencesRepository {
  private FILTER_REORDER_LIST = '#filter-container';

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

  getFilterDeletedMessage(): string {
    return 'Filter successfully deleted.';
  }

  // Filter reorder
  getFilterReorderListSelector(): string {
    return this.FILTER_REORDER_LIST;
  }

  getFilterItemSelector(idProductSearchAttribute: string): string {
    return `${this.FILTER_REORDER_LIST} ${this.item(idProductSearchAttribute)}`;
  }

  // Matches only when the `idAfter` item follows the `idBefore` one among its siblings, which is how
  // the reorder assertions read the list order without depending on absolute positions.
  getFilterPrecedingSibling(idBefore: string, idAfter: string): Cypress.Chainable {
    return cy.get(this.FILTER_REORDER_LIST).find(`${this.item(idBefore)} ~ ${this.item(idAfter)}`);
  }

  getSaveFilterOrderButton(): Cypress.Chainable {
    return cy.get('#save-filter-order');
  }

  getFilterOrderSaveAlert(): Cypress.Chainable {
    return cy.get('.swal2-container');
  }

  // Search preferences
  getSearchPreferencesListContainer(): Cypress.Chainable {
    return cy.get('.dt-container');
  }

  private item(idProductSearchAttribute: string): string {
    return `li.dd-item[data-id-product-search-attribute="${idProductSearchAttribute}"]`;
  }
}
