import { injectable } from 'inversify';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class Repository {
  getEmailInput = (): Cypress.Chainable => {
    return cy.get('#auth_username');
  };

  getPasswordInput = (): Cypress.Chainable => {
    return cy.get('#auth_password');
  };

  getSubmitButton = (): Cypress.Chainable => {
    return cy.get('.btn');
  };
}
