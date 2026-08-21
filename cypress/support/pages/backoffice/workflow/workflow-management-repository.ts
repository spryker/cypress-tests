import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class WorkflowManagementRepository {
  getCreateWorkflowButton = (): Cypress.Chainable => cy.get('a:contains("Create Workflow")');
  getProcessTable = (): Cypress.Chainable => cy.get('table:visible');
  getProcessRow = (name: string): Cypress.Chainable =>
    this.getProcessTable().find('tbody tr:visible').filter(`:contains("${name}")`);

  getProcessRowTriggersButton = (name: string): Cypress.Chainable =>
    this.getProcessRow(name).find('a:contains("Triggers")');
  getProcessRowActivateButton = (name: string): Cypress.Chainable =>
    this.getProcessRow(name).find('button:contains("Activate")');
  getProcessRowVersionsButton = (name: string): Cypress.Chainable =>
    this.getProcessRow(name).find('a:contains("Versions")');
  getProcessRowStatus = (name: string): Cypress.Chainable =>
    this.getProcessRow(name).find('[data-qa="workflow-process-status"]');
  getProcessRowActiveVersion = (name: string): Cypress.Chainable =>
    this.getProcessRow(name).find('[data-qa="workflow-process-active-version"]');
  getProcessRowTriggers = (name: string): Cypress.Chainable =>
    this.getProcessRow(name).find('[data-qa="workflow-process-triggers"]');

  getProcessNameInput = (): Cypress.Chainable => cy.get('[data-qa="workflow-process-name-input"]');
  getProcessSubjectTypeInput = (): Cypress.Chainable => cy.get('[data-qa="workflow-process-subject-type-input"]');
  getProcessSaveButton = (): Cypress.Chainable => cy.get('[data-qa="workflow-process-save"]');

  getTriggerEventSelect = (): Cypress.Chainable => cy.get('[data-qa="trigger-events-select"]');
  getTriggerEventDropdownOption = (label: string): Cypress.Chainable =>
    cy.get('.select2-dropdown .select2-results__option').contains(label);
  getTriggerSaveButton = (): Cypress.Chainable => cy.get('[data-qa="workflow-trigger-save"]');

  getCreateVersionButton = (): Cypress.Chainable => cy.get('a:contains("Create Version")');
  getVersionInitialStateInput = (): Cypress.Chainable => cy.get('[data-qa="workflow-version-initial-state-input"]');
  getVersionDefinitionInput = (): Cypress.Chainable => cy.get('[data-qa="workflow-version-definition-input"]');
  getValidateDefinitionButton = (): Cypress.Chainable => cy.get('[data-qa="workflow-validate-definition"]');
  getValidationResult = (): Cypress.Chainable => cy.get('[data-qa="workflow-definition-validation-result"]');
  getVersionSaveButton = (): Cypress.Chainable => cy.get('[data-qa="workflow-version-save"]');

  getActivateVersionButton = (): Cypress.Chainable => cy.get('[data-qa="workflow-version-activate"]:visible').first();

  getVersionActivationConfirmButton = (): Cypress.Chainable =>
    cy
      .get('[data-qa="version-activation-confirmation-modal"]:visible')
      .find('[data-qa="workflow-version-activation-confirm"]');

  getFlashMessage = (): Cypress.Chainable => cy.get('.alert:visible, [class*="flash-message"]:visible');
}
