import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantUserUpdateRepository {
  getStatusSelect = (): Cypress.Chainable => cy.get('select[name="user[status]"]');
  getIsActiveCheckbox = (): Cypress.Chainable => cy.get('input[name="user[is_active]"]');
  getPasswordInput = (): Cypress.Chainable => cy.get('input[name="user[password]"]');
  getPasswordConfirmInput = (): Cypress.Chainable => cy.get('input[name="user[password_confirm]"]');
  getSaveButton = (): Cypress.Chainable => cy.get('input[type="submit"]');
}
