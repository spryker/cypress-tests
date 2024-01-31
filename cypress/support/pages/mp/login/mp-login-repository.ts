import { injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class MpLoginRepository {
  getEmailInput = (): Cypress.Chainable => cy.get('#security-merchant-portal-gui_username');
  getPasswordInput = (): Cypress.Chainable => cy.get('#security-merchant-portal-gui_password');
  getSubmitButton = (): Cypress.Chainable =>
    cy.get('[name="security-merchant-portal-gui"]').find('button[type="submit"]');
  getFailedAuthenticationText = (): string => 'Authentication failed!';
}
