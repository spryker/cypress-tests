import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class UserCreateRepository {
  getUsernameInput = (): Cypress.Chainable => cy.get('#user_username');
  getPasswordInput = (): Cypress.Chainable => cy.get('#user_password_first');
  getRepeatPasswordInput = (): Cypress.Chainable => cy.get('#user_password_second');
  getFirstNameInput = (): Cypress.Chainable => cy.get('#user_first_name');
  getLastNameInput = (): Cypress.Chainable => cy.get('#user_last_name');
  getInterfaceLanguageSelect = (): Cypress.Chainable => cy.get('#user_fk_locale');
  getRootGroupCheckbox = (): Cypress.Chainable => cy.get('#user_group_0');
  getCreateUserButton = (): Cypress.Chainable => cy.get('form[name=user]').find('[type="submit"]');
  getAgentMerchantCheckbox = (): Cypress.Chainable => cy.get('#user_is_merchant_agent');
  getSuccessMessage = (): string => 'User was created successfully.';
}
