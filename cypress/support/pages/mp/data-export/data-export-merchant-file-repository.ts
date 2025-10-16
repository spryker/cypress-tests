import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class DataExportMerchantFileRepository {
  getStartExportButton(): Cypress.Chainable {
    return cy.contains('Start Export');
  }

  getTable(): Cypress.Chainable {
    return cy.get('table');
  }

  getTableSearchInput(): Cypress.Chainable {
    return cy.get('.spy-table-search-feature input[type="text"]');
  }

  getEntityTypeSelect(): Cypress.Chainable {
    return cy.get('select[name="data_export_merchant_file_form[exporterType]"]');
  }

  getIncludeProductAttributesCheckbox(): Cypress.Chainable {
    return cy.get('input[name="data_export_merchant_file_form[include_attributes]"]');
  }

  getFormSubmitButton(): Cypress.Chainable {
    return cy.get('web-spy-button').contains('Export');
  }
}
