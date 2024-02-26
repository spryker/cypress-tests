import { injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class LoginRepository {
  getEmailInput = (): Cypress.Chainable => cy.get('#auth_username');
  getPasswordInput = (): Cypress.Chainable => cy.get('#auth_password');
  getSubmitButton = (): Cypress.Chainable => cy.get('form[name=auth]:visible').find('[type="submit"]');
}
