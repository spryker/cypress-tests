import { injectable } from 'inversify';

import { AgentLoginRepository } from '../agent-login-repository';

@injectable()
export class B2bMpAgentLoginRepository implements AgentLoginRepository {
  getLoginEmailInput = (): Cypress.Chainable => cy.get('#loginForm_email');
  getLoginPasswordInput = (): Cypress.Chainable => cy.get('#loginForm_password');
  getLoginForm = (): Cypress.Chainable => cy.get('form[name=loginForm]');
  getFailedAuthenticationText = (): string => 'Authentication failed';
  getCaptchaWidget = (): Cypress.Chainable => cy.get('[data-qa="captcha-widget"]');
  getCaptchaCheckboxLabel = (): Cypress.Chainable => cy.get('[data-qa="captcha-widget"] label');
  getCaptchaPayloadInput = (): Cypress.Chainable =>
    cy.get('[data-qa="captcha-widget"] input[type="hidden"][name$="[captcha]"]');
  getCaptchaVerifiedStateSelector = (): string => '[data-state="verified"]';
  getCaptchaRequiredText = (): string => 'Please complete the security check.';
  getCaptchaInvalidText = (): string => 'The security check could not be verified. Please try again.';
  getAccountBlockedText = (): string => 'Too many login attempts. Please wait';
}
