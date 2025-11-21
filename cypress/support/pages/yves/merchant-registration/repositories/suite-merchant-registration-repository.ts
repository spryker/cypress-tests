import { injectable } from 'inversify';
import { MerchantRegistrationRepository } from '../merchant-registration-repository';

@injectable()
export class SuiteMerchantRegistrationRepository implements MerchantRegistrationRepository {
  getCompanyNameInput = (): Cypress.Chainable => cy.get('input[name="MerchantRegistrationRequestForm[company_name]"]');

  getCountrySelectContainer = (): Cypress.Chainable =>
    cy.get('#select2-MerchantRegistrationRequestForm_iso2_code-container');

  getCountrySelectOption = (): Cypress.Chainable => cy.get('.select2-results__option');

  getStreetInput = (): Cypress.Chainable => cy.get('input[name="MerchantRegistrationRequestForm[address1]"]');

  getHouseNumberInput = (): Cypress.Chainable => cy.get('input[name="MerchantRegistrationRequestForm[address2]"]');

  getZipCodeInput = (): Cypress.Chainable => cy.get('input[name="MerchantRegistrationRequestForm[zip_code]"]');

  getCityInput = (): Cypress.Chainable => cy.get('input[name="MerchantRegistrationRequestForm[city]"]');

  getRegistrationNumberInput = (): Cypress.Chainable =>
    cy.get('input[name="MerchantRegistrationRequestForm[registration_number]"]');

  getTitleSelectContainer = (): Cypress.Chainable =>
    cy.get('#select2-MerchantRegistrationRequestForm_contact_person_title-container');

  getTitleSelectOption = (): Cypress.Chainable => cy.get('.select2-results__option');

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
}
