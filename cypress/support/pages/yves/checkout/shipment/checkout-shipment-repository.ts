export interface CheckoutShipmentRepository {
  getMultiShipmentItemElement(): Cypress.Chainable;
  getStandardShipmentRadio($shipmentItem: JQuery<HTMLElement>, index: number): Cypress.Chainable;
  getNextButton(): Cypress.Chainable;
}
