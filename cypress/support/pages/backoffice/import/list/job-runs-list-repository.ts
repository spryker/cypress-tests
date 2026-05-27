import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class JobRunsListRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '[type="search"]';
  getDetailsButtonSelector = (): string => 'a:contains("Details")';
  getStatusCellSelector = (): string => 'td[class*="column-spy_import_job_run.status"]';
}
