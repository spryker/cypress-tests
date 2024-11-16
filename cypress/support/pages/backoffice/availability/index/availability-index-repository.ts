import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AvailabilityIndexRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '[type="search"]';
  getViewButtonSelector = (): string => 'a:contains("View")';
}
