import { autoWired } from '@utils';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
@autoWired
export class UserUpdateRepository {
  getAgentMerchantCheckbox = (): Cypress.Chainable => cy.get('#user_is_merchant_agent');
  getAgentCustomerCheckbox = (): Cypress.Chainable => cy.get('#user_is_agent');
  getUpdateUserButton = (): Cypress.Chainable => cy.get('form[name=user]').find('[type="submit"]');
  getPasswordInput = (): Cypress.Chainable => cy.get('#user_password_first');
  getRepeatPasswordInput = (): Cypress.Chainable => cy.get('#user_password_second');
}
