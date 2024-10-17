import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class EditShipmentMethodRepository {
  getStoreRelationTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-store-relation"]');
  getAllAvailableStoresInputs = (): Cypress.Chainable =>
    cy.get('input[name="shipment_method[storeRelation][id_stores][]"]');
  getPricesTab = (): Cypress.Chainable => cy.get('.nav-tabs li[data-tab-content-id="tab-content-price-tax"]');
  getPriceInputs = (): Cypress.Chainable => cy.get('#tab-content-price-tax input:text');
  getSaveButton = (): Cypress.Chainable => cy.get('[type="submit"]');
}
