import { injectable } from 'inversify';

import { CheckoutShipmentRepository } from '../checkout-shipment-repository';

@injectable()
export class B2cMpCheckoutShipmentRepository implements CheckoutShipmentRepository {
  getMultiShipmentGroups = (): Cypress.Chainable => cy.get('[data-qa="multi-shipment-group"]');
  getStandardShipmentRadio = ($shipmentItem: JQuery<HTMLElement>, index: number): Cypress.Chainable =>
    cy.wrap($shipmentItem).get(`#shipmentCollectionForm_shipmentGroups_${index}_shipment_shipmentSelection_0`);
  getNextButton = (): Cypress.Chainable => cy.get('[data-qa="submit-button"]');
    getShipmentDateInput = (): Cypress.Chainable =>
        cy.get('#shipmentCollectionForm_shipmentGroups_0_shipment_requestedDeliveryDate');
}
