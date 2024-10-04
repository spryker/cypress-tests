import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AgentLoginRepository {
  getEmailInput = (): Cypress.Chainable => cy.get('#agent-security-merchant-portal-gui_username');
  getPasswordInput = (): Cypress.Chainable => cy.get('#agent-security-merchant-portal-gui_password');
  getSubmitButton = (): Cypress.Chainable =>
    cy.get('[name="agent-security-merchant-portal-gui"]').find('button[type="submit"]');
  getFailedAuthenticationText = (): string => 'Please check that your E-mail address and password are correct and that you have confirmed your E-mail address by clicking the link in the registration message';
}
