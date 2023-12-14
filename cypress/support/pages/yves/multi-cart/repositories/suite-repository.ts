import { Repository } from '../repository';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class SuiteRepository implements Repository {
  getCreateCartNameInput = (): Cypress.Chainable => {
    return cy.get('#quoteForm_name');
  };

  getCreateCartForm = (): Cypress.Chainable => {
    return cy.get('form[name=quoteForm]');
  };
}
