import { Repository } from '../repository';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class B2bRepository implements Repository {
  getCreateCartNameInput = (): Cypress.Chainable => {
    return cy.get('#quoteForm_name');
  };

  getCreateCartForm = (): Cypress.Chainable => {
    return cy.get('form[name=quoteForm]');
  };
}
