import { injectable } from 'inversify';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class Repository {
  getViewButtons = (): Cypress.Chainable => {
    return cy.get('.btn-view');
  };
}
