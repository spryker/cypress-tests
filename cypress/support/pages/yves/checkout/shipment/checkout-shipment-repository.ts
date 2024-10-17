export interface CheckoutShipmentRepository {
  getMultiShipmentGroups(): Cypress.Chainable;
  getStandardShipmentRadio($shipmentItem: JQuery<HTMLElement>, index: number): Cypress.Chainable;
  getNextButton(): Cypress.Chainable;
  getShipmentDateInput(): Cypress.Chainable;
}
