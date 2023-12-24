import { injectable } from 'inversify';
import { autoProvide } from '../../../../utils/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class UserCreateRepository {
  getUsernameInput = (): Cypress.Chainable => {
    return cy.get('#user_username');
  };
  getPasswordInput = (): Cypress.Chainable => {
    return cy.get('#user_password_first');
  };
  getRepeatPasswordInput = (): Cypress.Chainable => {
    return cy.get('#user_password_second');
  };
  getFirstNameInput = (): Cypress.Chainable => {
    return cy.get('#user_first_name');
  };
  getLastNameInput = (): Cypress.Chainable => {
    return cy.get('#user_last_name');
  };
  getInterfaceLanguageSelect = (): Cypress.Chainable => {
    return cy.get('#user_fk_locale');
  };
  getRootGroupCheckbox = (): Cypress.Chainable => {
    return cy.get('#user_group_0');
  };
  getCreateUserButton = (): Cypress.Chainable => {
    return cy.get('form[name=user]').find('[type="submit"]');
  };
  getAgentMerchantCheckbox = (): Cypress.Chainable => {
    return cy.get('#user_is_merchant_agent');
  };
}
