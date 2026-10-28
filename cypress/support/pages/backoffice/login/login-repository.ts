import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class LoginRepository {
  getEmailInput = (): Cypress.Chainable => cy.get('#auth_username');
  getPasswordInput = (): Cypress.Chainable => cy.get('#auth_password');
  getSubmitButton = (): Cypress.Chainable => cy.get('form[name=auth]:visible').find('[type="submit"]');
  getLoginForm = (): Cypress.Chainable => cy.get('form[name=auth]:visible');
  getCaptchaWidget = (): Cypress.Chainable => cy.get('[data-qa="captcha-widget"]');
  getCaptchaCheckboxLabel = (): Cypress.Chainable => cy.get('[data-qa="captcha-widget"] label');
  getCaptchaPayloadInput = (): Cypress.Chainable =>
    cy.get('[data-qa="captcha-widget"] input[type="hidden"][name$="[captcha]"]');
  getCaptchaVerifiedStateSelector = (): string => '[data-state="verified"]';
  getFailedAuthenticationText = (): string => 'Authentication failed!';
  getCaptchaRequiredText = (): string => 'Please complete the security check.';
  getCaptchaInvalidText = (): string => 'The security check could not be verified. Please try again.';
  getAccountBlockedText = (): string => 'Too many login attempts. Please wait';
  getErrorMessage = (): Cypress.Chainable => cy.get('[data-qa="error-message"]');
}
