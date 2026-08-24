import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '../backoffice-page';
import { DataExchangeRepository } from './data-exchange-repository';

// Regenerates the Backend API schema the configuration list offers for download. Without the
// interval option the voter is skipped and the schema is rebuilt unconditionally, which is what
// a test needs — the scheduled job passes an interval so it can no-op between runs.
const GENERATE_SPECIFICATION_COMMAND = 'glue api:generate:documentation';

const CONFIGURATION_CREATE_URL = '/dynamic-entity-gui/configuration-create';
const CONFIGURATION_EDIT_URL = '/dynamic-entity-gui/configuration-edit';
const DOWNLOAD_FILE_NAME = 'schema.yml';

@injectable()
@autoWired
export class DataExchangePage extends BackofficePage {
  @inject(DataExchangeRepository) private repository: DataExchangeRepository;

  protected PAGE_URL = '/dynamic-entity-gui/configuration-list';

  regenerateApiSpecification = (): void => {
    cy.runCliCommands([GENERATE_SPECIFICATION_COMMAND]);
  };

  // The schema is only offered for download while it is newer than every configuration row, and
  // generation and the save that invalidated it can land in the same second. Regenerating on every
  // reload is the same loop the source test used to converge on a downloadable schema.
  waitForApiSpecificationToBeCurrent = (): void => {
    cy.reloadUntilGone(
      Cypress.env('backofficeUrl') + this.PAGE_URL,
      this.repository.getSpecificationOutdatedAlertSelector(),
      'body',
      10,
      2000,
      [GENERATE_SPECIFICATION_COMMAND]
    );
  };

  // A configuration for the table may already exist from an earlier run: the source test dropped it
  // from the database in teardown, which Cypress has no route to. The create form offers only
  // tables that have no configuration yet, so its option list is the discriminator — and the only
  // safe one, because the edit URL answers 500 rather than redirecting for a table that exists but
  // is unconfigured.
  openConfiguration = (tableName: string): void => {
    cy.visitBackoffice(CONFIGURATION_CREATE_URL);

    this.repository.getTableNameSelect().then(($select) => {
      if ($select.find(`option[value="${tableName}"]`).length) {
        this.createConfiguration(tableName);

        return;
      }

      cy.visitBackoffice(`${CONFIGURATION_EDIT_URL}?table-name=${tableName}`);
    });
  };

  setConfigurationEnabled = (isEnabled: boolean): void => {
    if (isEnabled) {
      this.repository.getIsEnabledCheckbox().check();

      return;
    }

    this.repository.getIsEnabledCheckbox().uncheck();
  };

  configureField = (field: FieldDefinition): void => {
    this.repository.getFieldDefinitionRow(field.name).within(() => {
      cy.get('input[name$="[is_enabled]"]').check();
      cy.get('input[name$="[field_visible_name]"]').clear();
      cy.get('input[name$="[field_visible_name]"]').type(field.name);
      cy.get('select[name$="[type]"]').select(field.type, { force: true });

      DataExchangePage.toggle('input[name$="[is_creatable]"]', field.isCreatable);
      DataExchangePage.toggle('input[name$="[is_editable]"]', field.isEditable);
      DataExchangePage.toggle('input[name$="[is_required]"]', field.isRequired);
    });
  };

  saveConfiguration = (): void => {
    this.repository.getSubmitButton().click();
  };

  downloadApiSpecification = (): void => {
    this.visit();
    this.repository.getDownloadSpecificationButton().click();
  };

  discardDownloadedApiSpecification = (): void => {
    cy.task('deleteFile', `${Cypress.config('downloadsFolder')}/${DOWNLOAD_FILE_NAME}`);
  };

  getDownloadedApiSpecification = (): Cypress.Chainable =>
    cy.readFile(`${Cypress.config('downloadsFolder')}/${DOWNLOAD_FILE_NAME}`);

  getDownloadSpecificationButton = (): Cypress.Chainable => this.repository.getDownloadSpecificationButton();

  getErrorMessage = (): Cypress.Chainable => this.repository.getErrorMessage();

  getResourceName = (): Cypress.Chainable => this.repository.getResourceNameInput().invoke('val');

  private createConfiguration = (tableName: string): void => {
    this.repository.getTableNameSelect().select(tableName, { force: true });
    this.repository.getSubmitButton().click();
  };

  private static toggle(selector: string, isChecked: boolean): void {
    if (isChecked) {
      cy.get(selector).check();

      return;
    }

    cy.get(selector).uncheck();
  }
}

export interface FieldDefinition {
  name: string;
  type: string;
  isCreatable: boolean;
  isEditable: boolean;
  isRequired: boolean;
}
