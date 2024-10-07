import { injectable } from 'inversify';

import { AgentLoginRepository } from '../agent-login-repository';

@injectable()
export class SuiteAgentLoginRepository implements AgentLoginRepository {
  getLoginEmailInput = (): Cypress.Chainable => cy.get('[data-qa="agent-login-form-email-input"]');
  getLoginPasswordInput = (): Cypress.Chainable => cy.get('[data-qa="agent-login-form-password-input"]');
  getLoginForm = (): Cypress.Chainable => cy.get('[data-qa="agent-login-form"]');
  getFailedAuthenticationText = (): string => 'Authentication failed';
}
