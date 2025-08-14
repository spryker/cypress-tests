import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class DataImportHistoryRepository {
  getStartImportButton(): Cypress.Chainable {
    return cy.contains('Start Import');
  }

  getTableSearchInput(): Cypress.Chainable {
    return cy.get('mp-file-imports-table').find('spy-input input');
  }

  getEntityTypeSelect(): Cypress.Chainable {
    return cy.get('select[name="merchant_file_import_form[entity_type]"]');
  }

  getFileInput(): Cypress.Chainable {
    return cy.get('input[name="merchant_file_import_form[merchantFile][file]"]');
  }

  getFormSubmitButton(): Cypress.Chainable {
    return cy.get('web-spy-button').contains('Import');
  }
}
