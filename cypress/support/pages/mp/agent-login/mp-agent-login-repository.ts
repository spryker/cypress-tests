import { injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class MpAgentLoginRepository {
  getEmailInput = (): Cypress.Chainable => cy.get('#agent-security-merchant-portal-gui_username');
  getPasswordInput = (): Cypress.Chainable => cy.get('#agent-security-merchant-portal-gui_password');
  getSubmitButton = (): Cypress.Chainable =>
    cy.get('[name="agent-security-merchant-portal-gui"]').find('button[type="submit"]');
  getFailedAuthenticationText = (): string => 'Authentication failed!';
}
