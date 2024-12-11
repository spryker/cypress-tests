import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class StoreListRepository {
  getCreateStoreButton = (): Cypress.Chainable => cy.get('body').find('a:contains("Create Store")');
  getEditButtonSelector = (): string => 'a:contains("Edit Store")';
  getViewButtonSelector = (): string => 'a:contains("View Store")';
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '[type="search"]';
}
