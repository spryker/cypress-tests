import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductManagementListRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '[type="search"]';
  getEditButtonSelector = (): string => 'a:contains("Edit")';
  getDenyButtonSelector = (): string => 'a:contains("Deny")';
}
