import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantUserCreateRepository {
  getEmailInput = (): Cypress.Chainable => cy.get('#merchant-user_username', { timeout: 10000 });
  getFirstNameInput = (): Cypress.Chainable => cy.get('#merchant-user_firstName');
  getLastNameInput = (): Cypress.Chainable => cy.get('#merchant-user_lastName');
  getSubmitButton = (): Cypress.Chainable => cy.get('form[name=merchant-user]').find('[type="submit"]');
}
