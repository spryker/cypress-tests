import { injectable } from 'inversify';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class MpAgentLoginRepository {
  getEmailInput = (): Cypress.Chainable => {
    return cy.get('#agent-security-merchant-portal-gui_username');
  };

  getPasswordInput = (): Cypress.Chainable => {
    return cy.get('#agent-security-merchant-portal-gui_password');
  };

  getSubmitButton = (): Cypress.Chainable => {
    return cy
      .get('[name="agent-security-merchant-portal-gui"]')
      .find('button[type="submit"]');
  };

  getFailedAuthenticationText = (): string => {
    return 'Authentication failed!';
  };
}
