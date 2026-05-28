import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ExportRepository {
  getExportButton = (): Cypress.Chainable => cy.get('#exportButton');
}
