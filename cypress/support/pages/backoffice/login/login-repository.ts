import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class LoginRepository {
  getEmailInput = (): Cypress.Chainable => cy.get('#auth_username');
  getPasswordInput = (): Cypress.Chainable => cy.get('#auth_password');
  getSubmitButton = (): Cypress.Chainable => cy.get('form[name=auth]:visible').find('[type="submit"]');
}
