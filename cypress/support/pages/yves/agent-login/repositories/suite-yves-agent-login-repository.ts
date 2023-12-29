import { injectable } from 'inversify';
import 'reflect-metadata';
import { YvesAgentLoginRepository } from '../yves-agent-login-repository';

@injectable()
export class SuiteYvesAgentLoginRepository implements YvesAgentLoginRepository {
  getLoginEmailInput = (): Cypress.Chainable => {
    return cy.get('#loginForm_email');
  };

  getLoginPasswordInput = (): Cypress.Chainable => {
    return cy.get('#loginForm_password');
  };

  getLoginForm = (): Cypress.Chainable => {
    return cy.get('form[name=loginForm]');
  };

  getFailedAuthenticationText = (): string => {
    return 'Authentication failed';
  };
}
