export class AddressRepository {
  getSelectShippingAddressField = () => {
    return cy.get('.select__select.js-address__form-select-shippingAddress');
  };

  getShippingAddressFirstNameField = () => {
    return cy.get('#addressesForm_shippingAddress_first_name');
  };

  getShippingAddressLastNameField = () => {
    return cy.get('#addressesForm_shippingAddress_last_name');
  };

  getShippingAddressAddress1Field = () => {
    return cy.get('#addressesForm_shippingAddress_address1');
  };

  getShippingAddressAddress2Field = () => {
    return cy.get('#addressesForm_shippingAddress_address2');
  };

  getShippingAddressZipCodeField = () => {
    return cy.get('#addressesForm_shippingAddress_zip_code');
  };

  getShippingAddressCityField = () => {
    return cy.get('#addressesForm_shippingAddress_city');
  };

  getShippingAddressCompanyField = () => {
    return cy.get('#addressesForm_shippingAddress_company');
  };

  getShippingAddressPhoneField = () => {
    return cy.get('#addressesForm_shippingAddress_phone');
  };

  getShippingAddressBillingSameAsShippingCheckbox = () => {
    return cy.get('#addressesForm_billingSameAsShipping');
  };

  getNextButton = () => {
    return cy.contains('button', 'Next');
  };

  getSelectBillingAddressField = () => {
    return cy.get('#addressesForm_billingAddress_id_customer_address');
  };

  getBillingAddressFirstNameField = () => {
    return cy.get('#addressesForm_billingAddress_first_name');
  };

  getBillingAddressLastNameField = () => {
    return cy.get('#addressesForm_billingAddress_last_name');
  };

  getBillingAddressAddress1Field = () => {
    return cy.get('#addressesForm_billingAddress_address1');
  };

  getBillingAddressAddress2Field = () => {
    return cy.get('#addressesForm_billingAddress_address2');
  };

  getBillingAddressZipCodeField = () => {
    return cy.get('#addressesForm_billingAddress_zip_code');
  };

  getBillingAddressCityField = () => {
    return cy.get('#addressesForm_billingAddress_city');
  };

  getBillingAddressCompanyField = () => {
    return cy.get('#addressesForm_billingAddress_company');
  };

  getBillingAddressPhoneField = () => {
    return cy.get('#addressesForm_billingAddress_phone');
  };

  getMultiShipmentTriggerButton = () => {
    return cy.get('.js-multiple-shipment-toggler__multiple-shipment-trigger');
  };

  getMultiShipmentAddressItemElement = () => {
    return cy.get('[data-qa="component address-item-form-field-list"]');
  };

  getMultiShipmentAddressItemDeliveryRadio = (
    $addressItem: JQuery<HTMLElement>
  ) => {
    return cy.wrap($addressItem).contains('span', 'Delivery');
  };

  getMultiShipmentAddressItemAddressField = (
    $addressItem: JQuery<HTMLElement>
  ) => {
    return cy.wrap($addressItem).contains('select', 'Select an address');
  };

  getMultiShipmentAddressItemAddressFirstNameField = (
    $addressItem: JQuery<HTMLElement>,
    index: number
  ) => {
    return cy
      .wrap($addressItem)
      .get(
        `#addressesForm_multiShippingAddresses_${index}_shippingAddress_first_name`
      );
  };

  getMultiShipmentAddressItemAddressLastNameField = (
    $addressItem: JQuery<HTMLElement>,
    index: number
  ) => {
    return cy
      .wrap($addressItem)
      .get(
        `#addressesForm_multiShippingAddresses_${index}_shippingAddress_last_name`
      );
  };

  getMultiShipmentAddressItemAddressAddress1Field = (
    $addressItem: JQuery<HTMLElement>,
    index: number
  ) => {
    return cy
      .wrap($addressItem)
      .get(
        `#addressesForm_multiShippingAddresses_${index}_shippingAddress_address1`
      );
  };

  getMultiShipmentAddressItemAddressAddress2Field = (
    $addressItem: JQuery<HTMLElement>,
    index: number
  ) => {
    return cy
      .wrap($addressItem)
      .get(
        `#addressesForm_multiShippingAddresses_${index}_shippingAddress_address2`
      );
  };

  getMultiShipmentAddressItemAddressCityField = (
    $addressItem: JQuery<HTMLElement>,
    index: number
  ) => {
    return cy
      .wrap($addressItem)
      .get(
        `#addressesForm_multiShippingAddresses_${index}_shippingAddress_city`
      );
  };

  getMultiShipmentAddressItemAddressZipCodeField = (
    $addressItem: JQuery<HTMLElement>,
    index: number
  ) => {
    return cy
      .wrap($addressItem)
      .get(
        `#addressesForm_multiShippingAddresses_${index}_shippingAddress_zip_code`
      );
  };

  getMultiShipmentAddressItemAddressCompanyField = (
    $addressItem: JQuery<HTMLElement>,
    index: number
  ) => {
    return cy
      .wrap($addressItem)
      .get(
        `#addressesForm_multiShippingAddresses_${index}_shippingAddress_company`
      );
  };

  getMultiShipmentAddressItemAddressPhoneField = (
    $addressItem: JQuery<HTMLElement>,
    index: number
  ) => {
    return cy
      .wrap($addressItem)
      .get(
        `#addressesForm_multiShippingAddresses_${index}_shippingAddress_phone`
      );
  };
}
