import { injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class SalesIndexRepository {
  getViewButtons = (): Cypress.Chainable => cy.get('.btn-view');
}
