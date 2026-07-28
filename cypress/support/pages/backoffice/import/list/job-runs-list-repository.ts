import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class JobRunsListRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody tr', { timeout: 10000 }).first();
  getSearchSelector = (): string => '[type="search"]';
  getDetailsButtonSelector = (): string => 'a:contains("Details")';
  getSuccessMessageSelector = (): string => '.alert-success, [data-qa="success-message"]';
  getFirstJobRunDetailsButton = (): Cypress.Chainable => this.getFirstTableRow().find('a:contains("Details")');
  getFirstTableRowStatus = (): Cypress.Chainable => this.getFirstTableRow().find('[class$=".status"]');
}
