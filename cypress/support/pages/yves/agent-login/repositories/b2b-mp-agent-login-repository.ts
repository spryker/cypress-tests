import { injectable } from 'inversify';

import { AgentLoginRepository } from '../agent-login-repository';

@injectable()
export class B2bMpAgentLoginRepository implements AgentLoginRepository {
  getLoginEmailInput = (): Cypress.Chainable => cy.get('#loginForm_email');
  getLoginPasswordInput = (): Cypress.Chainable => cy.get('#loginForm_password');
  getLoginForm = (): Cypress.Chainable => cy.get('form[name=loginForm]');
  getFailedAuthenticationText = (): string =>
    'Please check that your E-mail address and password are correct and that you have confirmed your E-mail address by clicking the link in the registration message';
}
