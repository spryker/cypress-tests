import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class JobsListRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getAllTableRows = (): Cypress.Chainable => cy.get('tbody tr:visible');
  getSearchSelector = (): string => '[type="search"]';
  getRunsButtonSelector = (): string => 'a:contains("Runs")';
  getCreateRunButtonSelector = (): string => 'button:contains("Create Run")';
  getSuccessRunsCellSelector = (): string => 'td[class*="column-success_runs"]';
}
