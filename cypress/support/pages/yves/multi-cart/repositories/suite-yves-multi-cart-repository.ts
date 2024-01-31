import { injectable } from 'inversify';
import 'reflect-metadata';
import { YvesMultiCartRepository } from '../yves-multi-cart-repository';

@injectable()
export class SuiteYvesMultiCartRepository implements YvesMultiCartRepository {
  getCreateCartNameInput = (): Cypress.Chainable => cy.get('#quoteForm_name');
  getCreateCartForm = (): Cypress.Chainable => cy.get('form[name=quoteForm]');
}
