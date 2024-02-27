import { injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class SalesOrdersRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1)');
  getSearchSelector = (): string => '.spy-table-search-feature input[type="text"]';
  getDrawer = (): Cypress.Chainable => cy.get('.spy-drawer-wrapper');
}
