import { autoWired } from '@utils';
import { injectable } from 'inversify';

const FIELD_ID_PREFIX = 'shipment_group_form_shipment';

@injectable()
@autoWired
export class SalesShipmentFormRepository {
  getDeliveryAddressSelect = (): Cypress.Chainable => cy.get(`#${FIELD_ID_PREFIX}_shippingAddress_idCustomerAddress`);
  getSalutationSelect = (): Cypress.Chainable => cy.get(`#${FIELD_ID_PREFIX}_shippingAddress_salutation`);
  getFirstNameField = (): Cypress.Chainable => cy.get(`#${FIELD_ID_PREFIX}_shippingAddress_firstName`);
  getLastNameField = (): Cypress.Chainable => cy.get(`#${FIELD_ID_PREFIX}_shippingAddress_lastName`);
  getEmailField = (): Cypress.Chainable => cy.get(`#${FIELD_ID_PREFIX}_shippingAddress_email`);
  getCountrySelect = (): Cypress.Chainable => cy.get(`#${FIELD_ID_PREFIX}_shippingAddress_iso2Code`);
  getAddress1Field = (): Cypress.Chainable => cy.get(`#${FIELD_ID_PREFIX}_shippingAddress_address1`);
  getAddress2Field = (): Cypress.Chainable => cy.get(`#${FIELD_ID_PREFIX}_shippingAddress_address2`);
  getCityField = (): Cypress.Chainable => cy.get(`#${FIELD_ID_PREFIX}_shippingAddress_city`);
  getZipCodeField = (): Cypress.Chainable => cy.get(`#${FIELD_ID_PREFIX}_shippingAddress_zipCode`);
  getShipmentMethodSelect = (): Cypress.Chainable => cy.get(`#${FIELD_ID_PREFIX}_method_idShipmentMethod`);

  // The form lists every item of the order with a checkbox, so an item joins the shipment being
  // saved by having its own row's box checked.
  getOrderItemCheckbox = (sku: string): Cypress.Chainable =>
    cy.get(`table[data-qa="order-item-list"] tbody tr:has(div.sku:contains("${sku}")) td.item-checker input`);

  getSaveButton = (): Cypress.Chainable => cy.get('input[type="submit"][value="Save"]');
}
