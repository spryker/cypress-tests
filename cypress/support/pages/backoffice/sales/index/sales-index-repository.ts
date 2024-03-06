import { autoWired } from '@utils';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
@autoWired
export class SalesIndexRepository {
  getViewButtons = (): Cypress.Chainable => cy.get('.btn-view');
}
