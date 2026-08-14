import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { WorkflowManagementRepository } from './workflow-management-repository';

@injectable()
@autoWired
export class WorkflowManagementPage extends BackofficePage {
  @inject(WorkflowManagementRepository) private repository: WorkflowManagementRepository;

  protected PAGE_URL = '/workflow/process';

  createWorkflow = (params: { name: string; subjectType: string }): void => {
    this.repository.getCreateWorkflowButton().click();
    this.repository.getProcessNameInput().clear().type(params.name);
    this.repository.getProcessSubjectTypeInput().clear().type(params.subjectType);
    this.repository.getProcessSaveButton().click();
  };

  configureTrigger = (params: { name: string; eventLabel: string }): void => {
    this.repository.getProcessRowTriggersButton(params.name).click();
    // Select2 combobox: open the dropdown next to the native select, then pick the option by its label.
    this.repository.getTriggerEventSelect().siblings('.select2-container').find('.select2-selection').click();
    this.repository.getTriggerEventDropdownOption(params.eventLabel).click();
    this.repository.getTriggerSaveButton().click();
  };

  createVersion = (params: { name: string; initialState: string; definition: string }): void => {
    this.repository.getProcessRowVersionsButton(params.name).click();
    this.repository.getCreateVersionButton().click();
    this.repository.getVersionInitialStateInput().clear().type(params.initialState);
    this.repository
      .getVersionDefinitionInput()
      .clear()
      .type(params.definition, { parseSpecialCharSequences: false, delay: 0 });
  };

  validateDefinition = (): void => {
    this.repository.getValidateDefinitionButton().click();
  };

  saveVersion = (): void => {
    this.repository.getVersionSaveButton().click();
  };

  activateLatestVersion = (): void => {
    this.repository.getActivateVersionButton().click();
    this.repository.getVersionActivationConfirmButton().click();
  };

  getValidationResult = (): Cypress.Chainable => this.repository.getValidationResult();

  getProcessRow = (name: string): Cypress.Chainable => this.repository.getProcessRow(name);

  getProcessRowStatus = (name: string): Cypress.Chainable => this.repository.getProcessRowStatus(name);

  getProcessRowActiveVersion = (name: string): Cypress.Chainable => this.repository.getProcessRowActiveVersion(name);

  getProcessRowTriggers = (name: string): Cypress.Chainable => this.repository.getProcessRowTriggers(name);
}
