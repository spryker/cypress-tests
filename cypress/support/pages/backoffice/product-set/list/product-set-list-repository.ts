import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductSetListRepository {
  getSearchInput = (): Cypress.Chainable => cy.get('input[aria-controls="product-set-table"]');
  getTableInfo = (): Cypress.Chainable => cy.get('#product-set-table_info');
  getTableProcessing = (): Cypress.Chainable => cy.get('#product-set-table_processing');
  getTableRows = (): Cypress.Chainable => cy.get('#product-set-table tbody tr');
  getDeleteButtonSelector = (): string => 'button[data-qa="delete-button"]';
}
