import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class StockListRepository {
  getEditButtonSelector = (): string => 'a:contains("Edit")';
  getViewButtonSelector = (): string => 'a:contains("View")';
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '[type="search"]';
  getStoreCellSelector = (): string => 'div[class*="spy_merchant_store-"]';
}
