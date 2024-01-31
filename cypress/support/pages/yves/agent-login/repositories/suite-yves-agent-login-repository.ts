import { injectable } from 'inversify';
import 'reflect-metadata';
import { YvesAgentLoginRepository } from '../yves-agent-login-repository';

@injectable()
export class SuiteYvesAgentLoginRepository implements YvesAgentLoginRepository {
  getLoginEmailInput = (): Cypress.Chainable => cy.get('#loginForm_email');
  getLoginPasswordInput = (): Cypress.Chainable => cy.get('#loginForm_password');
  getLoginForm = (): Cypress.Chainable => cy.get('form[name=loginForm]');
  getFailedAuthenticationText = (): string => 'Authentication failed';
}
