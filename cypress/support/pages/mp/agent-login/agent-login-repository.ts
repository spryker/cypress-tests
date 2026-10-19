import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AgentLoginRepository {
  getEmailInput = (): Cypress.Chainable => cy.get('#agent-security-merchant-portal-gui_username');
  getPasswordInput = (): Cypress.Chainable => cy.get('#agent-security-merchant-portal-gui_password');
  getSubmitButton = (): Cypress.Chainable =>
    cy.get('[name="agent-security-merchant-portal-gui"]').find('button[type="submit"]');
  getFailedAuthenticationText = (): string => 'Authentication failed!';
  getCaptchaWidget = (): Cypress.Chainable => cy.get('[data-qa="captcha-widget"]');
  getCaptchaCheckboxLabel = (): Cypress.Chainable => cy.get('[data-qa="captcha-widget"] label');
  getCaptchaPayloadInput = (): Cypress.Chainable =>
    cy.get('[data-qa="captcha-widget"] input[type="hidden"][name$="[captcha]"]');
  getCaptchaVerifiedStateSelector = (): string => '[data-state="verified"]';
  getCaptchaRequiredText = (): string => 'Please complete the security check.';
  getCaptchaInvalidText = (): string => 'The security check could not be verified. Please try again.';
  getAccountBlockedText = (): string => 'Too many login attempts. Please wait';
}
