export interface Repository {
  getSelectShippingAddressField(): Cypress.Chainable;

  getShippingAddressFirstNameField(): Cypress.Chainable;

  getShippingAddressLastNameField(): Cypress.Chainable;

  getShippingAddressAddress1Field(): Cypress.Chainable;

  getShippingAddressAddress2Field(): Cypress.Chainable;

  getShippingAddressZipCodeField(): Cypress.Chainable;

  getShippingAddressCityField(): Cypress.Chainable;

  getShippingAddressCompanyField(): Cypress.Chainable;

  getShippingAddressPhoneField(): Cypress.Chainable;

  getShippingAddressBillingSameAsShippingCheckbox(): Cypress.Chainable;

  getNextButton(): Cypress.Chainable;

  getSelectBillingAddressField(): Cypress.Chainable;

  getBillingAddressFirstNameField(): Cypress.Chainable;

  getBillingAddressLastNameField(): Cypress.Chainable;

  getBillingAddressAddress1Field(): Cypress.Chainable;

  getBillingAddressAddress2Field(): Cypress.Chainable;

  getBillingAddressZipCodeField(): Cypress.Chainable;

  getBillingAddressCityField(): Cypress.Chainable;

  getBillingAddressCompanyField(): Cypress.Chainable;

  getBillingAddressPhoneField(): Cypress.Chainable;

  getMultiShipmentTriggerButton(): Cypress.Chainable;

  getMultiShipmentAddressItemElement(): Cypress.Chainable;

  getMultiShipmentAddressItemDeliveryRadio(
    $addressItem: JQuery<HTMLElement>
  ): Cypress.Chainable;

  getMultiShipmentAddressItemAddressField(
    $addressItem: JQuery<HTMLElement>
  ): Cypress.Chainable;

  getMultiShipmentAddressItemAddressFirstNameField(
    $addressItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable;

  getMultiShipmentAddressItemAddressLastNameField(
    $addressItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable;

  getMultiShipmentAddressItemAddressAddress1Field(
    $addressItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable;

  getMultiShipmentAddressItemAddressAddress2Field(
    $addressItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable;

  getMultiShipmentAddressItemAddressCityField(
    $addressItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable;

  getMultiShipmentAddressItemAddressZipCodeField(
    $addressItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable;

  getMultiShipmentAddressItemAddressCompanyField(
    $addressItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable;

  getMultiShipmentAddressItemAddressPhoneField(
    $addressItem: JQuery<HTMLElement>,
    index: number
  ): Cypress.Chainable;
}
