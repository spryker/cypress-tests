import { injectable } from 'inversify';

import { AgentLoginRepository } from '../agent-login-repository';

@injectable()
export class SuiteAgentLoginRepository implements AgentLoginRepository {
  getLoginEmailInput = (): Cypress.Chainable => cy.get('[data-qa="agent-login-form-email-input"]');
  getLoginPasswordInput = (): Cypress.Chainable => cy.get('[data-qa="agent-login-form-password-input"]');
  getLoginForm = (): Cypress.Chainable => cy.get('[data-qa="agent-login-form"]');
  getFailedAuthenticationText = (): string =>
    'Please check that your E-mail address and password are correct and that you have confirmed your E-mail address by clicking the link in the registration message';
}
