import { injectable } from 'inversify';
import { CustomerAddressRepository } from '../customer-address-repository';

@injectable()
export class SuiteCustomerAddressRepository implements CustomerAddressRepository {
  getSalutationSelect(): Cypress.Chainable {
    return cy.get('select[name="addressForm[salutation]"]');
  }
  getFirstNameInput(): Cypress.Chainable {
    return cy.get('input[name="addressForm[first_name]"]');
  }
  getLastNameInput(): Cypress.Chainable {
    return cy.get('input[name="addressForm[last_name]"]');
  }
  getCompanyInput(): Cypress.Chainable {
    return cy.get('input[name="addressForm[company]"]');
  }
  getPhoneInput(): Cypress.Chainable {
    return cy.get('input[name="addressForm[phone]"]');
  }
  getAddress1Input(): Cypress.Chainable {
    return cy.get('input[name="addressForm[address1]"]');
  }
  getAddress2Input(): Cypress.Chainable {
    return cy.get('input[name="addressForm[address2]"]');
  }
  getAddress3Input(): Cypress.Chainable {
    return cy.get('input[name="addressForm[address3]"]');
  }
  getCityInput(): Cypress.Chainable {
    return cy.get('input[name="addressForm[city]"]');
  }
  getZipCodeInput(): Cypress.Chainable {
    return cy.get('input[name="addressForm[zip_code]"]');
  }
  getCountrySelect(): Cypress.Chainable {
    return cy.get('select[name="addressForm[iso2_code]"]');
  }
  getSubmitButton(): Cypress.Chainable {
    return cy.get('form[name="addressForm"] button[type="submit"]');
  }
  getAddNewAddressLink(): Cypress.Chainable {
    return cy.get('[data-qa="customer-add-new-address"]');
  }
  getAddressAddedMessage(): string {
    return 'Address was successfully added';
  }
}
