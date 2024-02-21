import { injectable } from 'inversify';
import 'reflect-metadata';
import { YvesCheckoutShipmentRepository } from '../yves-checkout-shipment-repository';

@injectable()
export class SuiteYvesCheckoutShipmentRepository implements YvesCheckoutShipmentRepository {
  getMultiShipmentItemElement = (): Cypress.Chainable => cy.get('.form__fields.grid.grid--bottom');
  getStandardShipmentRadio = ($shipmentItem: JQuery<HTMLElement>, index: number): Cypress.Chainable =>
    cy.wrap($shipmentItem).get(`#shipmentCollectionForm_shipmentGroups_${index}_shipment_shipmentSelection_0`);
  getNextButton = (): Cypress.Chainable => cy.contains('button', 'Next');
}
