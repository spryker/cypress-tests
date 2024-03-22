import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class OffersRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '.spy-table-search-feature input[type="text"]';
  getSaveButtonSelector = (): string => 'button:contains("Save")';
  getDrawer = (): Cypress.Chainable => cy.get('.spy-drawer-wrapper');
}
