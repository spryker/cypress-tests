import { injectable } from 'inversify';
import 'reflect-metadata';
import { CheckoutShipmentRepository } from '../checkout-shipment-repository';

@injectable()
export class SuiteCheckoutShipmentRepository implements CheckoutShipmentRepository {
  getMultiShipmentItemElement = (): Cypress.Chainable => cy.get('.form__fields.grid.grid--bottom');
  getStandardShipmentRadio = ($shipmentItem: JQuery<HTMLElement>, index: number): Cypress.Chainable =>
    cy.wrap($shipmentItem).get(`#shipmentCollectionForm_shipmentGroups_${index}_shipment_shipmentSelection_0`);
  getNextButton = (): Cypress.Chainable => cy.contains('button', 'Next');
}
