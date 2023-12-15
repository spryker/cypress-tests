import { Repository } from '../repository';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class SuiteRepository implements Repository {
  getMultiShipmentItemElement = (): Cypress.Chainable => {
    return cy.get('.form__fields.grid.grid--bottom');
  };

  getStandardShipmentRadio = (
    $shipmentItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable => {
    return cy
      .wrap($shipmentItem)
      .get(
        `#shipmentCollectionForm_shipmentGroups_${index}_shipment_shipmentSelection_0`
      );
  };

  getNextButton = (): Cypress.Chainable => {
    return cy.contains('button', 'Next');
  };
}
