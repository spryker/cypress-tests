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
    this.fillCreateForm(params);
    this.submitCreateForm();
  };

  fillCreateForm = (params: {
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
  };

  submitCreateForm = (): void => {
    this.repository.getProcessSaveButton().click();
  };

  renameCanvasState = (params: { currentName: string; newName: string }): void => {
    this.repository.getCanvasStateByLabel(params.currentName).click();
    this.repository.getStateNameInput().clear().type(params.newName);
  };

  renameCanvasTransitionEvent = (params: { currentEventName: string; newEventName: string }): void => {
    this.selectCanvasTransition(params.currentEventName);
    this.repository.getTransitionEventInput().clear().type(params.newEventName).blur();
  };

  selectCanvasTransition = (eventName: string): void => {
    this.repository.getCanvasTransitionLabel(eventName).first().click({ force: true });
  };

  openNewVersion = (): void => {
    this.repository.getNewVersionButton().click();
  };

  saveVersion = (): void => {
    this.repository.getVersionSaveButton().click();
  };

  activateLatestVersion = (): void => {
    this.repository.getVersionListButton().click();
    this.repository.getActivateVersionButton().click();
    this.repository.getActionConfirmationConfirmButton().click();
  };

  saveProcessDescription = (description: string): void => {
    this.repository.getProcessEditToggle().click();
    this.repository.getProcessEditDescriptionInput().clear().type(description);
    this.repository.getProcessEditSaveButton().click();
  };

  deactivateProcess = (name: string): void => {
    this.repository.getProcessRowDeactivateButton(name).click();
    this.repository.getActionConfirmationConfirmButton().click();
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
    this.repository.getActionConfirmationConfirmButton().click();
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

  getProcessForm = (): Cypress.Chainable => this.repository.getProcessForm();

  getStateNameInput = (): Cypress.Chainable => this.repository.getStateNameInput();

  getCanvas = (): Cypress.Chainable => this.repository.getCanvas();

  getEventSharedHint = (): Cypress.Chainable => this.repository.getEventSharedHint();

  getEventTransitionCount = (): Cypress.Chainable => this.repository.getEventTransitionCount();

  getDefinitionValidationResult = (): Cypress.Chainable => this.repository.getDefinitionValidationResult();

  getVersionSource = (): Cypress.Chainable => this.repository.getVersionSource();

  getActiveVersionNumber = (): Cypress.Chainable => this.repository.getActiveVersionNumber();

  getSummaryDescription = (): Cypress.Chainable => this.repository.getSummaryDescription();

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
