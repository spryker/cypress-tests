import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class SalesIndexRepository {
  getViewButtons = (): Cypress.Chainable => cy.get('.btn-view');
}
