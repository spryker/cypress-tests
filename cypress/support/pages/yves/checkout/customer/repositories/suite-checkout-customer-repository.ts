import { injectable } from 'inversify';

import { CheckoutCustomerRepository } from '../checkout-customer-repository';

@injectable()
export class SuiteCheckoutCustomerRepository implements CheckoutCustomerRepository {
  getGuestRadioButton = (): Cypress.Chainable => cy.get('[data-qa="component toggler-radio checkoutProceedAs guest"]');
  getGuestFirstNameField = (): Cypress.Chainable => cy.get('#guestForm_customer_first_name');
  getGuestLastNameField = (): Cypress.Chainable => cy.get('#guestForm_customer_last_name');
  getGuestEmailField = (): Cypress.Chainable => cy.get('#guestForm_customer_email');
  getGuestTermsCheckbox = (): Cypress.Chainable =>
    cy.get('[data-qa="component checkbox guestForm[customer][accept_terms] guestForm_customer_accept_terms"]');
  getGuestSubmitButton = (): Cypress.Chainable => cy.get('[data-qa="guest-form-submit-button"]');
  getLoginRadioButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component toggler-radio checkoutProceedAs register"]');
  getLoginEmailField = (): Cypress.Chainable => cy.get('#loginForm_email');
  getLoginPasswordField = (): Cypress.Chainable => cy.get('#loginForm_password');
  getLoginSubmitButton = (): Cypress.Chainable => cy.get('form[name="loginForm"]').find('button[type="submit"]');
  getRegisterSalutationField = (): Cypress.Chainable => cy.get('#registerForm_customer_salutation');
  getRegisterFirstNameField = (): Cypress.Chainable => cy.get('#registerForm_customer_first_name');
  getRegisterLastNameField = (): Cypress.Chainable => cy.get('#registerForm_customer_last_name');
  getRegisterEmailField = (): Cypress.Chainable => cy.get('#registerForm_customer_email');
  getRegisterPasswordField = (): Cypress.Chainable => cy.get('#registerForm_customer_password_pass');
  getRegisterConfirmPasswordField = (): Cypress.Chainable => cy.get('#registerForm_customer_password_confirm');
  getRegisterTermsCheckbox = (): Cypress.Chainable => cy.get('#registerForm_customer_accept_terms');
  getRegisterSubmitButton = (): Cypress.Chainable => cy.get('[data-qa*="register-form"]').find('button[type="submit"]');
}
