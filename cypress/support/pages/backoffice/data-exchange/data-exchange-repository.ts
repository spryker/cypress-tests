import { autoWired } from '@utils';
import { injectable } from 'inversify';

// The field-definition table renders one row per column of the configured table, each row a
// Symfony collection entry, so every control is addressed by the suffix of its generated name.
const FIELD_CONTROL_SELECTORS: Record<FieldControl, string> = {
  enabled: 'input[name$="[is_enabled]"]',
  visibleName: 'input[name$="[field_visible_name]"]',
  type: 'select[name$="[type]"]',
  creatable: 'input[name$="[is_creatable]"]',
  editable: 'input[name$="[is_editable]"]',
  required: 'input[name$="[is_required]"]',
};

@injectable()
@autoWired
export class DataExchangeRepository {
  getTableNameSelect = (): Cypress.Chainable => cy.get('#dynamic-entity_table_name');

  getResourceNameInput = (): Cypress.Chainable => cy.get('#dynamic-entity_table_alias');

  getIsEnabledCheckbox = (): Cypress.Chainable => cy.get('#dynamic-entity_is_active');

  getSubmitButton = (): Cypress.Chainable => cy.get('button.safe-submit');

  getFieldDefinitionRow = (fieldName: string): Cypress.Chainable =>
    cy.get(`input[id^="dynamic-entity_field_definitions"][value="${fieldName}"]`).closest('tr');

  getFieldDefinitionControl = (fieldName: string, control: FieldControl): Cypress.Chainable =>
    this.getFieldDefinitionRow(fieldName).find(FIELD_CONTROL_SELECTORS[control]);

  getFieldControlSelector = (control: FieldControl): string => FIELD_CONTROL_SELECTORS[control];

  getDownloadSpecificationButtonSelector = (): string => 'a[href*="documentation/download"]';

  getDownloadSpecificationButton = (): Cypress.Chainable => cy.get(this.getDownloadSpecificationButtonSelector());

  getSpecificationOutdatedAlertSelector = (): string => '[data-qa="alert-documentation-generation-in-progress"]';

  getErrorMessage = (): Cypress.Chainable => cy.get('.alert-danger');

  getConfigurationSavedMessage = (): string => 'Configuration is updated successfully';
}

export type FieldControl = 'enabled' | 'visibleName' | 'type' | 'creatable' | 'editable' | 'required';
