import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { WorkflowManagementRepository } from './workflow-management-repository';

@injectable()
@autoWired
export class WorkflowManagementPage extends BackofficePage {
  @inject(WorkflowManagementRepository) private repository: WorkflowManagementRepository;

  protected PAGE_URL = '/workflow/process';

  createWorkflow = (params: {
    name: string;
    subjectType: string;
    triggerEventLabel: string;
    initialState: string;
    definition: string;
  }): void => {
    this.visitCreate();
    this.repository.getProcessNameInput().clear().type(params.name);
    this.selectSubjectType(params.subjectType);
    this.selectTriggerEvent(params.triggerEventLabel);
    this.seedDefinition({ initialState: params.initialState, definition: params.definition });
    this.repository.getProcessSaveButton().click();
  };

  visitCreate = (): void => {
    cy.visitBackoffice(`${this.PAGE_URL}/create`);
  };

  selectSubjectType = (subjectType: string): void => {
    // Pick through the Select2 widget, not the native select: Select2 announces the change with a jQuery event only.
    this.repository.getProcessSubjectTypeInput().siblings('.select2-container').find('.select2-selection').click();
    this.repository.getSelect2Option(subjectType).click();
  };

  selectTriggerEvent = (triggerEventLabel: string): void => {
    this.repository.getProcessTriggerEventsSelect().siblings('.select2-container').find('.select2-selection').click();
    this.repository.getSelect2Option(triggerEventLabel).click();
  };

  getProcessTriggerEventsSelect = (): Cypress.Chainable => this.repository.getProcessTriggerEventsSelect();

  activateFirstVersion = (name: string): void => {
    this.repository.getProcessRowViewButton(name).click();
    this.repository.getVersionListButton().click();
    this.repository.getActivateVersionButton().click();
    this.repository.getVersionActivationConfirmButton().click();
  };

  activateProcess = (name: string): void => {
    this.repository.getProcessRowActivateButton(name).click();
    this.repository.getActionConfirmationConfirmButton().click();
  };

  getProcessRow = (name: string): Cypress.Chainable => this.repository.getProcessRow(name);

  getProcessRowStatus = (name: string): Cypress.Chainable => this.repository.getProcessRowStatus(name);

  getProcessRowActiveVersion = (name: string): Cypress.Chainable => this.repository.getProcessRowActiveVersion(name);

  getProcessRowTriggers = (name: string): Cypress.Chainable => this.repository.getProcessRowTriggers(name);

  getProcessRowActivateButton = (name: string): Cypress.Chainable => this.repository.getProcessRowActivateButton(name);

  private seedDefinition = (params: { initialState: string; definition: string }): void => {
    this.repository.getAdvancedXmlToggle().click();
    this.repository
      .getAdvancedXmlEditor()
      .clear()
      .type(params.definition, { parseSpecialCharSequences: false, delay: 0 });

    this.repository.getCanvasStateByLabel(params.initialState).click();
    this.repository.getStateInitialCheckbox().check();
  };
}
