import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ExportRepository {
  getExportTypeSelect = (): Cypress.Chainable => cy.get('#exportType');

  getExportTemplateButton = (): Cypress.Chainable => cy.get('#exportTemplateButton');

  getExportButton = (): Cypress.Chainable => cy.get('#exportButton');
}
