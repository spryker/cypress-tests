import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class PageListRepository {
  getEditButtonSelector = (): string => 'button:contains("Edit")';
  getPublishButtonSelector = (): string => 'button:contains("Publish")';
  // getPublishButtonSelector = (): string => 'a:contains("Publish")';
  // getViewButtonSelector = (): string => 'a:contains("View")';
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '[type="search"]';
}
