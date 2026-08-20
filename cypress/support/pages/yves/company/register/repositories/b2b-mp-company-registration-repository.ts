import { injectable } from 'inversify';

import { CompanyRegistrationRepository } from '../company-registration-repository';

@injectable()
export class B2bMpCompanyRegistrationRepository implements CompanyRegistrationRepository {
  getSalutationSelect = (): Cypress.Chainable => cy.get('[name="company_register_form[salutation]"]');
  getFirstNameInput = (): Cypress.Chainable => cy.get('[name="company_register_form[first_name]"]');
  getLastNameInput = (): Cypress.Chainable => cy.get('[name="company_register_form[last_name]"]');
  getCompanyNameInput = (): Cypress.Chainable => cy.get('[name="company_register_form[company_name]"]');
  getEmailInput = (): Cypress.Chainable => cy.get('[name="company_register_form[email]"]');
  // The repeated password type renders as two subfields, addressed by id rather than by name.
  getPasswordInput = (): Cypress.Chainable => cy.get('#company_register_form_password_pass');
  getConfirmPasswordInput = (): Cypress.Chainable => cy.get('#company_register_form_password_confirm');
  getAcceptTermsCheckbox = (): Cypress.Chainable => cy.get('[name="company_register_form[accept_terms]"]');
  getRegistrationForm = (): Cypress.Chainable => cy.get('form[name="company_register_form"]');
  getPageTitle = (): Cypress.Chainable => cy.get('h2.title');
  getPageTitleText = (): string => 'Create account';
  getRegistrationCompletedMessage = (): string =>
    'Almost there! We send you an email to validate your email address. Please confirm it to be able to log in.';
}
