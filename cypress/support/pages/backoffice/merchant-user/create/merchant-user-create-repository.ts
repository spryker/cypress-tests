import { injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class MerchantUserCreateRepository {
  getEmailInput = (): Cypress.Chainable => cy.get('#merchant-user_username');
  getFirstNameInput = (): Cypress.Chainable => cy.get('#merchant-user_firstName');
  getLastNameInput = (): Cypress.Chainable => cy.get('#merchant-user_lastName');
  getCreateButton = (): Cypress.Chainable => cy.get('form[name=merchant-user]').find('[type="submit"]');
}