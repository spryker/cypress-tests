import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AccountRepository {
  getChangePasswordButton = (): Cypress.Chainable =>
    cy.get('web-spy-button-action[action*="change-password"] button', { timeout: 20000 });

  getDefaultPasswordInput = (): Cypress.Chainable =>
    cy.get('input[name="security-merchant-portal-gui_change-password[current_password]"]', { timeout: 20000 });

  getNewPasswordInput = (): Cypress.Chainable =>
    cy.get('input[name="security-merchant-portal-gui_change-password[new_password][first]"]', { timeout: 20000 });

  getConfirmPasswordInput = (): Cypress.Chainable =>
    cy.get('input[name="security-merchant-portal-gui_change-password[new_password][second]"]', { timeout: 20000 });

  getSubmitButton = (): Cypress.Chainable =>
    cy.get('[name="security-merchant-portal-gui_change-password[save]"] button[type="submit"]', { timeout: 20000 });

  getPasswordChangedMessage = (): string => 'Success! The Password is updated.';
}
