import { injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class BackofficeSalesIndexRepository {
  getViewButtons = (): Cypress.Chainable => cy.get('.btn-view');
}
