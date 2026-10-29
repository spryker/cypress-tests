import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { WorkflowInstanceLifecycleRepository } from './workflow-instance-lifecycle-repository';

@injectable()
@autoWired
export class WorkflowInstanceLifecyclePage extends BackofficePage {
  @inject(WorkflowInstanceLifecycleRepository) private repository: WorkflowInstanceLifecycleRepository;

  protected PAGE_URL = '/workflow/process';

  openWorkflowActivity = (workflowName: string): void => {
    this.visit();
    this.repository.getProcessRowViewButton(workflowName).click();
  };

  triggerManualAction = (params: { identifier: number; eventName: string }): void => {
    this.repository.getInstanceRowManualAction(params.identifier, params.eventName).click();
  };

  getWorkflowActivityTable = (): Cypress.Chainable => this.repository.getWorkflowActivityTable();

  getWorkflowActivityHeaders = (): Cypress.Chainable => this.repository.getWorkflowActivityHeaders();

  getInstanceRow = (identifier: number): Cypress.Chainable => this.repository.getInstanceRow(identifier);

  getInstanceRowState = (identifier: number): Cypress.Chainable => this.repository.getInstanceRowState(identifier);

  getInstanceRowStatus = (identifier: number): Cypress.Chainable => this.repository.getInstanceRowStatus(identifier);

  openInstanceView = (identifier: number): void => {
    this.repository.getInstanceRowViewButton(identifier).click();
  };

  triggerInstanceManualEvent = (eventName: string): void => {
    this.repository.getInstanceManualAction(eventName).click();
  };

  getInstanceCurrentState = (): Cypress.Chainable => this.repository.getInstanceCurrentState();

  getInstanceManualActions = (): Cypress.Chainable => this.repository.getInstanceManualActions();

  getInstanceBackButton = (): Cypress.Chainable => this.repository.getInstanceBackButton();

  getPageActionButtons = (): Cypress.Chainable => this.repository.getPageActionButtons();

  getInstanceRowManualAction = (identifier: number, eventName: string): Cypress.Chainable =>
    this.repository.getInstanceRowManualAction(identifier, eventName);
}
