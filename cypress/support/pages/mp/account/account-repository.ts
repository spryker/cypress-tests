import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AccountRepository {
  getChangePasswordButton = (): Cypress.Chainable => cy.get('web-spy-button-action[action*="change-password"] button');

  getDefaultPasswordInput = (): Cypress.Chainable =>
    cy.get('input[name="security-merchant-portal-gui_change-password[current_password]"]');

  getNewPasswordInput = (): Cypress.Chainable =>
    cy.get('input[name="security-merchant-portal-gui_change-password[new_password][first]"]');

  getConfirmPasswordInput = (): Cypress.Chainable =>
    cy.get('input[name="security-merchant-portal-gui_change-password[new_password][second]"]');

  getSubmitButton = (): Cypress.Chainable =>
    cy.get('[name="security-merchant-portal-gui_change-password[save]"] button[type="submit"]');

  getPasswordChangedMessage = (): string => 'Success! The Password is updated.';
}
