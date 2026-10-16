import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class BlockListRepository {
  getEditButtonSelector = (): string => 'a:contains("Edit Block")';
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getVisibleRowSelector = (): string => 'tbody > tr:visible';
  getSearchSelector = (): string => '[type="search"]';
  getStoreCellSelector = (): string => '.column-Store';
}
