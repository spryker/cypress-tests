import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class DataImportMerchantFileRepository {
  getStartImportButton(): Cypress.Chainable {
    return cy.contains('Start Import');
  }

  getTableSearchInput(): Cypress.Chainable {
    return cy.get('.spy-table-search-feature input[type="text"]');
  }

  getEntityTypeSelect(): Cypress.Chainable {
    return cy.get('select[name="data_import_merchant_file_form[importerType]"]');
  }

  getFileInput(): Cypress.Chainable {
    return cy.get('input[name="data_import_merchant_file_form[fileInfo][file]"]');
  }

  getFormSubmitButton(): Cypress.Chainable {
    return cy.get('web-spy-button').contains('Import');
  }
}
