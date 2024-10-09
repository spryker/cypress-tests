import { injectable } from 'inversify';

import { LoginRepository } from '../login-repository';

@injectable()
export class B2bMpLoginRepository implements LoginRepository {
  getLoginEmailInput = (): Cypress.Chainable => cy.get('#loginForm_email');
  getLoginPasswordInput = (): Cypress.Chainable => cy.get('#loginForm_password');
  getLoginForm = (): Cypress.Chainable => cy.get('form[name=loginForm]');
  getRegisterSalutationSelect = (): Cypress.Chainable => cy.get('#registerForm_salutation');
  getRegisterFirstNameInput = (): Cypress.Chainable => cy.get('#registerForm_first_name');
  getRegisterLastNameInput = (): Cypress.Chainable => cy.get('#registerForm_last_name');
  getRegisterEmailInput = (): Cypress.Chainable => cy.get('#registerForm_email');
  getRegisterPasswordInput = (): Cypress.Chainable => cy.get('#registerForm_password_pass');
  getRegisterConfirmPasswordInput = (): Cypress.Chainable => cy.get('#registerForm_password_confirm');
  getRegisterAcceptTermsCheckbox = (): Cypress.Chainable => cy.get('#registerForm_accept_terms');
  getRegisterForm = (): Cypress.Chainable => cy.get('form[name=registerForm]');
  getFailedAuthenticationText = (): string =>
    'Please check that your E-mail address and password are correct and that you have confirmed your E-mail address by clicking the link in the registration message';
  getRegistrationCompletedMessage = (): string =>
    'Almost there! We send you an email to validate your email address. Please confirm it to be able to log in.';
  getRegistrationToggleRadio = (): Cypress.Chainable =>
    cy.get('[data-qa="component toggler-radio accountLoginSwitcher register"]');
}
