import { injectable } from 'inversify';
import 'reflect-metadata';
import { AgentLoginRepository } from '../agent-login-repository';

@injectable()
export class SuiteAgentLoginRepository implements AgentLoginRepository {
  getLoginEmailInput = (): Cypress.Chainable => cy.get('#loginForm_email');
  getLoginPasswordInput = (): Cypress.Chainable => cy.get('#loginForm_password');
  getLoginForm = (): Cypress.Chainable => cy.get('form[name=loginForm]');
  getFailedAuthenticationText = (): string => 'Authentication failed';
}
