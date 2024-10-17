import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class StockEditRepository {
  getStoreRelationTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-store-relation"]');
  getAllAvailableStoresInputs = (): Cypress.Chainable => cy.get('input[name="stock[storeRelation][id_stores][]"]');
  getSaveButton = (): Cypress.Chainable => cy.get('[type="submit"]');
}
