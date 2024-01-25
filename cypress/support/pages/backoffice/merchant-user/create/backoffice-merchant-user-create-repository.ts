import { injectable } from 'inversify';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class BackofficeMerchantUserCreateRepository {
  getEmailInput = (): Cypress.Chainable => {
    return cy.get('#merchant-user_username');
  };

  getFirstNameInput = (): Cypress.Chainable => {
    return cy.get('#merchant-user_firstName');
  };

  getLastNameInput = (): Cypress.Chainable => {
    return cy.get('#merchant-user_lastName');
  };

  getCreateButton = (): Cypress.Chainable => {
    return cy.get('form[name=merchant-user]').find('[type="submit"]');
  };
}
