import { injectable } from 'inversify';

import { AgentLoginRepository } from '../agent-login-repository';

@injectable()
export class B2cMpAgentLoginRepository implements AgentLoginRepository {
  getLoginEmailInput = (): Cypress.Chainable => cy.get('#loginForm_email');
  getLoginPasswordInput = (): Cypress.Chainable => cy.get('#loginForm_password');
  getLoginForm = (): Cypress.Chainable => cy.get('form[name=loginForm]');
  getFailedAuthenticationText = (): string => 'Authentication failed';
}
