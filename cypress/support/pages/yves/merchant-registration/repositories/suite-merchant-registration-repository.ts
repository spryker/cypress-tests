import { injectable } from 'inversify';
import { MerchantRegistrationRepository } from '../merchant-registration-repository';

@injectable()
export class SuiteMerchantRegistrationRepository implements MerchantRegistrationRepository {
  getCompanyNameInput = (): Cypress.Chainable => cy.get('input[name="MerchantRegistrationRequestForm[company_name]"]');

  getStreetInput = (): Cypress.Chainable => cy.get('input[name="MerchantRegistrationRequestForm[address1]"]');

  getHouseNumberInput = (): Cypress.Chainable => cy.get('input[name="MerchantRegistrationRequestForm[address2]"]');

  getZipCodeInput = (): Cypress.Chainable => cy.get('input[name="MerchantRegistrationRequestForm[zip_code]"]');

  getCityInput = (): Cypress.Chainable => cy.get('input[name="MerchantRegistrationRequestForm[city]"]');

  getRegistrationNumberInput = (): Cypress.Chainable =>
    cy.get('input[name="MerchantRegistrationRequestForm[registration_number]"]');

  getFirstNameInput = (): Cypress.Chainable =>
    cy.get('input[name="MerchantRegistrationRequestForm[contact_person_first_name]"]');

  getLastNameInput = (): Cypress.Chainable =>
    cy.get('input[name="MerchantRegistrationRequestForm[contact_person_last_name]"]');

  getRoleInput = (): Cypress.Chainable => cy.get('input[name="MerchantRegistrationRequestForm[contact_person_role]"]');

  getEmailInput = (): Cypress.Chainable => cy.get('input[name="MerchantRegistrationRequestForm[email]"]');

  getPhoneInput = (): Cypress.Chainable =>
    cy.get('input[name="MerchantRegistrationRequestForm[contact_person_phone]"]');

  getAcceptTermsCheckbox = (): Cypress.Chainable =>
    cy.get('input[type="checkbox"][name="MerchantRegistrationRequestForm[accept_terms]"]');

  getSubmitButton = (): Cypress.Chainable => cy.get('button.button--wider');

  selectCountry(country: string): void {
    cy.get('select[name="MerchantRegistrationRequestForm[iso2_code]"]').select(country);
  }

  selectTitle(title: string): void {
    cy.get('select[name="MerchantRegistrationRequestForm[contact_person_title]"]').select(title);
  }
}
