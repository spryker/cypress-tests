export interface AddressFormData {
  salutation: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  zipCode: string;
  iso2Code: string;
}

export interface CustomerAddressRepository {
  getSalutationSelect(): Cypress.Chainable;
  getFirstNameInput(): Cypress.Chainable;
  getLastNameInput(): Cypress.Chainable;
  getCompanyInput(): Cypress.Chainable;
  getPhoneInput(): Cypress.Chainable;
  getAddress1Input(): Cypress.Chainable;
  getAddress2Input(): Cypress.Chainable;
  getAddress3Input(): Cypress.Chainable;
  getCityInput(): Cypress.Chainable;
  getZipCodeInput(): Cypress.Chainable;
  getCountrySelect(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getAddNewAddressLink(): Cypress.Chainable;
  getAddressAddedMessage(): string;
}
