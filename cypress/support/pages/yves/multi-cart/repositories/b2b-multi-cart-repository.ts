import { injectable } from 'inversify';
import 'reflect-metadata';
import { MultiCartRepository } from '../multi-cart-repository';

@injectable()
export class B2bMultiCartRepository implements MultiCartRepository {
  getCreateCartNameInput = (): Cypress.Chainable => cy.get('#quoteForm_name');
  getCreateCartForm = (): Cypress.Chainable => cy.get('form[name=quoteForm]');
}
