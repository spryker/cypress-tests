import { injectable } from 'inversify';
import 'reflect-metadata';
import { CheckoutAddressRepository } from '../checkout-address-repository';

@injectable()
export class SuiteCheckoutAddressRepository implements CheckoutAddressRepository {
  getSelectShippingAddressField = (): Cypress.Chainable =>
    cy.get('.select__select.js-address__form-select-shippingAddress');
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
  getNextButton = (): Cypress.Chainable => cy.contains('button', 'Next');
  getSelectBillingAddressField = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_id_customer_address');
  getBillingAddressFirstNameField = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_first_name');
  getBillingAddressLastNameField = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_last_name');
  getBillingAddressAddress1Field = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_address1');
  getBillingAddressAddress2Field = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_address2');
  getBillingAddressZipCodeField = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_zip_code');
  getBillingAddressCityField = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_city');
  getBillingAddressCompanyField = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_company');
  getBillingAddressPhoneField = (): Cypress.Chainable => cy.get('#addressesForm_billingAddress_phone');
  getMultiShipmentTriggerButton = (): Cypress.Chainable =>
    cy.get('.js-multiple-shipment-toggler__multiple-shipment-trigger');
  getMultiShipmentAddressItemElement = (): Cypress.Chainable =>
    cy.get('[data-qa="component address-item-form-field-list"]');
  getMultiShipmentAddressItemDeliveryRadio = ($addressItem: JQuery<HTMLElement>): Cypress.Chainable =>
    cy.wrap($addressItem).contains('span', 'Delivery');
  getMultiShipmentAddressItemAddressField = ($addressItem: JQuery<HTMLElement>): Cypress.Chainable =>
    cy.wrap($addressItem).contains('select', 'Select an address');
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