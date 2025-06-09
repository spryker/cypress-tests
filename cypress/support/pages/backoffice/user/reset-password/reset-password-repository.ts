import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ResetPasswordRepository {
  getCurrentPasswordInput = (): Cypress.Chainable => cy.get('#reset_password_current_password');
  getNewPasswordInput = (): Cypress.Chainable => cy.get('#reset_password_password_first');
  getConfirmPasswordInput = (): Cypress.Chainable => cy.get('#reset_password_password_second');
  getSubmitButton = (): Cypress.Chainable => cy.get('input[type="submit"]');
}
