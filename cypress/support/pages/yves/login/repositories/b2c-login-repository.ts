import { injectable } from 'inversify';

import { LoginRepository } from '../login-repository';

@injectable()
export class B2cLoginRepository implements LoginRepository {
  getLoginEmailInput = (): Cypress.Chainable => cy.get('#loginForm_email');
  getLoginPasswordInput = (): Cypress.Chainable => cy.get('#loginForm_password');
  getLoginForm = (): Cypress.Chainable => cy.get('form[name=loginForm]');
  getRegisterSalutationSelect = (): Cypress.Chainable => cy.get('[name="registerForm[salutation]"]');
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
  getForgotPasswordLink(): Cypress.Chainable {
    return cy.get('[data-qa="customer-forgot-password-link"]');
  }
  getForgotPasswordEmailInput(): Cypress.Chainable {
    return cy.get('#forgottenPassword_email');
  }
  getCaptchaWidget = (): Cypress.Chainable => cy.get('[data-qa="captcha-widget"]');
  getCaptchaCheckboxLabel = (): Cypress.Chainable => cy.get('[data-qa="captcha-widget"] label');
  getCaptchaPayloadInput = (): Cypress.Chainable =>
    cy.get('[data-qa="captcha-widget"] input[type="hidden"][name$="[captcha]"]');
  getCaptchaVerifiedStateSelector = (): string => '[data-state="verified"]';
  getCaptchaRequiredText = (): string => 'Please complete the security check.';
  getCaptchaInvalidText = (): string => 'The security check could not be verified. Please try again.';
  getAccountBlockedText = (): string => 'Too many login attempts. Please wait';
}
