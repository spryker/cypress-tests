import { injectable } from 'inversify';

import { CheckoutAddressRepository } from '../checkout-address-repository';

@injectable()
export class B2cMpCheckoutAddressRepository implements CheckoutAddressRepository {
  // The single-shipment address form offers the service point through its own selector component;
  // the multi-shipment getters above are per address item and do not match here.
  getSelectServicePointButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component service-point-selector"]').find('button');
  getSelectedServicePoint = (): Cypress.Chainable => cy.get('[data-qa="component service-point"]');
  getShippingAddressSaveToAddressBookCheckbox = (): Cypress.Chainable =>
    cy.get('#addressesForm_shippingAddress_isAddressSavingSkipped');
  getBillingAddressSaveToAddressBookCheckbox = (): Cypress.Chainable =>
    cy.get('#addressesForm_billingAddress_isAddressSavingSkipped');
  // With an active company user the shipping select is rendered with no id and named
  // checkout-full-addresses, so an id-based getter finds nothing. This class sits on the select
  // in both layouts, and is what a business unit address has to be picked through.
  getShippingAddressSelectElement = (): Cypress.Chainable => cy.get('.js-address__form-select-shippingAddress');
  getSelectShippingAddressField = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_id_customer_address');
  getShippingAddressFirstNameField = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_first_name');
  getShippingAddressLastNameField = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_last_name');
  getShippingAddressAddress1Field = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_address1');
  getShippingAddressAddress2Field = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_address2');
  getShippingAddressZipCodeField = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_zip_code');
  getShippingAddressCityField = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_city');
  getShippingAddressCompanyField = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_company');
  getShippingAddressPhoneField = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_phone');
  getShippingAddressBillingSameAsShippingCheckbox = (): Cypress.Chainable =>
    cy.get('#addressesForm_billingSameAsShipping');
  getNextButton = (): Cypress.Chainable => cy.get('[data-qa="submit-button"]');
  getSelectBillingAddressField = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_id_customer_address');
  getBillingAddressFirstNameField = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_first_name');
  getBillingAddressLastNameField = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_last_name');
  getBillingAddressAddress1Field = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_address1');
  getBillingAddressAddress2Field = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_address2');
  getBillingAddressZipCodeField = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_zip_code');
  getBillingAddressCityField = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_city');
  getBillingAddressCompanyField = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_company');
  getBillingAddressPhoneField = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_phone');
  getMultiShipmentTriggerButton = (): Cypress.Chainable => cy.get('[data-qa="multiple-shipment-trigger-button"]');
  getMultiShipmentAddressItemElement = (): Cypress.Chainable =>
    cy.get('[data-qa="component address-item-form-field-list"]');
  getAddressItemFormFieldListElement = (): Cypress.Chainable =>
    cy.get('[data-qa="component address-item-form-field-list"]');
  getMultiShipmentAddressItemDeliveryRadio = ($addressItem: JQuery<HTMLElement>, index: number): Cypress.Chainable =>
    cy.wrap($addressItem).get(`#addressesForm_multiShippingAddresses_${index}_shipmentType_key [value="delivery"]`);
  getMultiShipmentAddressItemAddressField = ($addressItem: JQuery<HTMLElement>, index: number): Cypress.Chainable =>
    cy.wrap($addressItem).get(`#addressesForm_multiShippingAddresses_${index}_shippingAddress_id_customer_address`);
  getMultiShipmentAddressItemAddressFirstNameField = (
    $addressItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable =>
    cy.wrap($addressItem).get(`#addressesForm_multiShippingAddresses_${index}_shippingAddress_first_name`);
  getMultiShipmentAddressItemAddressLastNameField = (
    $addressItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable =>
    cy.wrap($addressItem).get(`#addressesForm_multiShippingAddresses_${index}_shippingAddress_last_name`);
  getMultiShipmentAddressItemAddressAddress1Field = (
    $addressItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable =>
    cy.wrap($addressItem).get(`#addressesForm_multiShippingAddresses_${index}_shippingAddress_address1`);
  getMultiShipmentAddressItemAddressAddress2Field = (
    $addressItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable =>
    cy.wrap($addressItem).get(`#addressesForm_multiShippingAddresses_${index}_shippingAddress_address2`);
  getMultiShipmentAddressItemAddressCityField = ($addressItem: JQuery<HTMLElement>, index: number): Cypress.Chainable =>
    cy.wrap($addressItem).get(`#addressesForm_multiShippingAddresses_${index}_shippingAddress_city`);
  getMultiShipmentAddressItemAddressZipCodeField = (
    $addressItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable =>
    cy.wrap($addressItem).get(`#addressesForm_multiShippingAddresses_${index}_shippingAddress_zip_code`);
  getMultiShipmentAddressItemAddressCompanyField = (
    $addressItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable =>
    cy.wrap($addressItem).get(`#addressesForm_multiShippingAddresses_${index}_shippingAddress_company`);
  getMultiShipmentAddressItemAddressPhoneField = (
    $addressItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable =>
    cy.wrap($addressItem).get(`#addressesForm_multiShippingAddresses_${index}_shippingAddress_phone`);
  getShipmentTypeRadio = (shipmentType: string): Cypress.Chainable =>
    cy.get(`[data-qa="shipment-type-radio"][value="${shipmentType}"]`);
}
