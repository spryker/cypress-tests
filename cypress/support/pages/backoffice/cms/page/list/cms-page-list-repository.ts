import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CmsPageListRepository {
  // DataTables renders the CMS page grid with the `dataTable` class; the first data cell
  // is the terminal settled node the Codeception waitForElementVisible asserted on.
  getFirstRowFirstCell = (): Cypress.Chainable =>
    cy.get('table.dataTable tbody tr:first-child td:first-child', { timeout: 20000 });
}
