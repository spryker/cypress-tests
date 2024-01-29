import { injectable } from 'inversify';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class MpOffersRepository {
  getFirstTableRow = (): Cypress.Chainable => {
    return cy.get('tbody > :nth-child(1)');
  };

  getSearchSelector = (): string => {
    return '.spy-table-search-feature input[type="text"]';
  };

  getDrawer = (): Cypress.Chainable => {
    return cy.get('.spy-drawer-wrapper');
  };
}
