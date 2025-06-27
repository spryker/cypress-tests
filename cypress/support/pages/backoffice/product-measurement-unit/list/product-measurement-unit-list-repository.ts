import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductMeasurementUnitListRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '[type="search"]';
  getEditButtonSelector = (): string => 'a:contains("Edit")';
  getStoreCellSelector = (): string => 'td[class*="column-store_relation"]';
  getDenyButtonSelector = (): string => 'a:contains("Deny")';
}
