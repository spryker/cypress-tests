import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class DataExchangeRepository {
  getTableNameSelect = (): Cypress.Chainable => cy.get('#dynamic-entity_table_name');

  getResourceNameInput = (): Cypress.Chainable => cy.get('#dynamic-entity_table_alias');

  getIsEnabledCheckbox = (): Cypress.Chainable => cy.get('#dynamic-entity_is_active');

  getSubmitButton = (): Cypress.Chainable => cy.get('button.safe-submit');

  getFieldDefinitionRow = (fieldName: string): Cypress.Chainable =>
    cy.get(`input[id^="dynamic-entity_field_definitions"][value="${fieldName}"]`).closest('tr');

  getDownloadSpecificationButtonSelector = (): string => 'a[href*="documentation/download"]';

  getDownloadSpecificationButton = (): Cypress.Chainable => cy.get(this.getDownloadSpecificationButtonSelector());

  getSpecificationOutdatedAlertSelector = (): string => '[data-qa="alert-documentation-generation-in-progress"]';

  getErrorMessage = (): Cypress.Chainable => cy.get('.alert-danger');
}
