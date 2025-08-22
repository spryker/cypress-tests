import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductManagementListRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '[type="search"]';
  getEditButtonSelector = (): string => 'a:contains("Edit")';
  getStoreCellSelector = (): string => 'td[class*="column-store_relation"]';
  getApproveButtonSelector = (): string => 'a:contains("Approve")';
  getDenyButtonSelector = (): string => 'a:contains("Deny")';
  getFilterStatusSelect = (): Cypress.Chainable => cy.get('#select2-table_filter_form_status-container');
  getFilterStoresSelect = (): Cypress.Chainable => cy.get('#table_filter_form_stores').next();
  getSelectOption = (): Cypress.Chainable => cy.get('.select2-results__option');
  getFilterButton = (): Cypress.Chainable => cy.get('#product-management-filter-form button');
  getTableRows = (): Cypress.Chainable => cy.get('.dataTables_scrollBody tbody tr', { timeout: 10000 });
  getFilterSearchInput = (): Cypress.Chainable => cy.get('.dataTables_filter [type=search]');
  getResetButton = (): Cypress.Chainable => cy.get('#product-management-filter-form a[href="/product-management"]');
}
