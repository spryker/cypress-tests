import { injectable } from 'inversify';

import { CheckoutAddressRepository } from '../checkout-address-repository';

@injectable()
export class B2bCheckoutAddressRepository implements CheckoutAddressRepository {
  getSelectShippingAddressField = (): Cypress.Chainable => {
    return cy.get('body').then((body) => {
      if (body.find('#addressesForm_shippingAddress_id_customer_address').length === 1) {
        return cy.get('#addressesForm_shippingAddress_id_customer_address');
      }

      return cy.get('[name="checkout-full-addresses"]').first();
    });
  };
  getShippingAddressFirstNameField = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_first_name');
  getShippingAddressLastNameField = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_last_name');
  getShippingAddressAddress1Field = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_address1');
  getShippingAddressAddress2Field = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_address2');
  getShippingAddressZipCodeField = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_zip_code');
  getShippingAddressCityField = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_city');
  getShippingAddressCompanyField = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_company');
  getShippingAddressPhoneField = (): Cypress.Chainable => cy.get('#addressesForm_shippingAddress_phone');
  getShippingAddressBillingSameAsShippingCheckbox = (): Cypress.Chainable =>
    cy.get('#addressesForm_billingSameAsShipping input');
  getNextButton = (): Cypress.Chainable => cy.get('[data-qa="submit-button"]');
  getSelectBillingAddressField = (): Cypress.Chainable => {
    return cy.get('body').then((body) => {
      if (body.find('#addressesForm_billingAddress_id_customer_address').length === 1) {
        return cy.get('#addressesForm_billingAddress_id_customer_address');
      }

      return cy.get('[name="checkout-full-addresses"]').last();
    });
  };
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
  getMultiShipmentAddressItemAddressField = ($addressItem: JQuery<HTMLElement>, index: number): Cypress.Chainable => {
    return cy.get('body').then((body) => {
      if (
        body.find(`#addressesForm_multiShippingAddresses_${index}_shippingAddress_id_customer_address`).length === 1
      ) {
        return cy.get(`#addressesForm_multiShippingAddresses_${index}_shippingAddress_id_customer_address`);
      }

      return cy.get('[name="checkout-full-addresses"]').eq(index + 1);
    });
  };
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
}
