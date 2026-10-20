import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class WorkflowManagementRepository {
  getCreateWorkflowButton = (): Cypress.Chainable => cy.get('a:contains("Create Workflow")');
  getProcessTable = (): Cypress.Chainable => cy.get('table:visible');
  getProcessRow = (name: string): Cypress.Chainable =>
    this.getProcessTable().find('tbody tr:visible').filter(`:contains("${name}")`);

  getProcessRowActivateButton = (name: string): Cypress.Chainable =>
    this.getProcessRow(name).find('button:contains("Activate")');
  getProcessRowDeactivateButton = (name: string): Cypress.Chainable =>
    this.getProcessRow(name).find('button:contains("Deactivate")');
  getProcessRowViewButton = (name: string): Cypress.Chainable => this.getProcessRow(name).find('a:contains("View")');
  getProcessRowStatus = (name: string): Cypress.Chainable =>
    this.getProcessRow(name).find('[data-qa="workflow-process-status"]');
  getProcessRowActiveVersion = (name: string): Cypress.Chainable =>
    this.getProcessRow(name).find('[data-qa="workflow-process-active-version"]');
  getProcessRowTriggers = (name: string): Cypress.Chainable =>
    this.getProcessRow(name).find('[data-qa="workflow-process-triggers"]');

  getProcessNameInput = (): Cypress.Chainable => cy.get('[data-qa="workflow-process-name-input"]');
  getProcessSubjectTypeInput = (): Cypress.Chainable => cy.get('[data-qa="workflow-process-subject-type-input"]');
  getProcessSaveButton = (): Cypress.Chainable => cy.get('[data-qa="workflow-process-save"]');
  getProcessForm = (): Cypress.Chainable => cy.get('[data-qa="workflow-process-form"]');
  getProcessTriggerEventsSelect = (): Cypress.Chainable => cy.get('[data-qa="workflow-process-trigger-events-select"]');
  getSelect2Option = (label: string): Cypress.Chainable =>
    cy.get('.select2-dropdown .select2-results__option').contains(new RegExp(`^${label}$`));

  // The version form is driven by the visual builder: the raw initialState/definition inputs are hidden
  // (js-version-fields). The definition is seeded through the builder's "Advanced: raw XML" escape hatch,
  // and the initial state is set by selecting a state on the canvas and ticking its "initial" checkbox.
  getAdvancedXmlToggle = (): Cypress.Chainable => cy.get('[data-qa="workflow-advanced-toggle"]');
  getAdvancedXmlEditor = (): Cypress.Chainable => cy.get('[data-qa="workflow-xml-editor"]');
  getCanvas = (): Cypress.Chainable => cy.get('[data-qa="workflow-canvas"]');
  // State nodes are JointJS SVG shapes labelled with the state's display name; the node carries no
  // data-qa, so it is reached by its rendered label text within the canvas.
  getCanvasStateByLabel = (label: string): Cypress.Chainable => this.getCanvas().find('text').contains(label);
  getStateInitialCheckbox = (): Cypress.Chainable => cy.get('[data-qa="workflow-state-initial"]');
  getStateNameInput = (): Cypress.Chainable => cy.get('[data-qa="workflow-state-name"]');
  getCanvasTransitionLabel = (eventName: string): Cypress.Chainable =>
    this.getCanvas().contains('text', eventName).siblings('rect');
  getTransitionEventInput = (): Cypress.Chainable => cy.get('[data-qa="workflow-transition-event"]');
  getEventSharedHint = (): Cypress.Chainable => cy.get('[data-qa="workflow-event-shared-hint"]');
  getEventTransitionCount = (): Cypress.Chainable => cy.get('[data-qa="workflow-event-transition-count"]');
  getDefinitionValidationResult = (): Cypress.Chainable => cy.get('[data-qa="workflow-definition-validation-result"]');

  getVersionListButton = (): Cypress.Chainable => cy.get('[data-qa="workflow-version-list"]');
  getNewVersionButton = (): Cypress.Chainable => cy.get('[data-qa="workflow-active-version-new-version"]');
  getVersionSource = (): Cypress.Chainable => cy.get('[data-qa="workflow-version-source"]');
  getVersionSaveButton = (): Cypress.Chainable => cy.get('[data-qa="workflow-version-save"]');
  getActiveVersionNumber = (): Cypress.Chainable => cy.get('[data-qa="workflow-active-version-number"]');

  getProcessEditToggle = (): Cypress.Chainable => cy.get('[data-qa="workflow-process-edit-toggle"]');
  getProcessEditDescriptionInput = (): Cypress.Chainable =>
    cy.get('[data-qa="workflow-process-edit-description-input"]');
  getProcessEditSaveButton = (): Cypress.Chainable => cy.get('[data-qa="workflow-process-edit-save"]');
  getSummaryDescription = (): Cypress.Chainable => cy.get('[data-qa="workflow-summary-description"]');

  getActivateVersionButton = (): Cypress.Chainable => cy.get('[data-qa="workflow-version-activate"]:visible').first();

  getActionConfirmationConfirmButton = (): Cypress.Chainable =>
    cy.get('[data-qa="action-confirmation-modal"]:visible').find('[data-qa="action-confirmation-confirm"]');

  getFlashMessage = (): Cypress.Chainable => cy.get('.alert:visible, [class*="flash-message"]:visible');
}
