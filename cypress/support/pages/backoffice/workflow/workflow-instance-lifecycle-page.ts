import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { WorkflowInstanceLifecycleRepository } from './workflow-instance-lifecycle-repository';

@injectable()
@autoWired
export class WorkflowInstanceLifecyclePage extends BackofficePage {
  @inject(WorkflowInstanceLifecycleRepository) private repository: WorkflowInstanceLifecycleRepository;

  protected PAGE_URL = '/workflow/process';

  openInstances = (workflowName: string): void => {
    this.visit();
    this.repository.getProcessRowVersionsButton(workflowName).click();
    this.repository.getVersionRowInstancesButton().click();
  };

  triggerManualAction = (params: { identifier: number; eventName: string }): void => {
    this.repository.getInstanceRowManualAction(params.identifier, params.eventName).click();
  };

  getInstanceRow = (identifier: number): Cypress.Chainable => this.repository.getInstanceRow(identifier);

  getInstanceRowState = (identifier: number): Cypress.Chainable => this.repository.getInstanceRowState(identifier);

  getInstanceRowStatus = (identifier: number): Cypress.Chainable => this.repository.getInstanceRowStatus(identifier);

  getInstanceRowManualAction = (identifier: number, eventName: string): Cypress.Chainable =>
    this.repository.getInstanceRowManualAction(identifier, eventName);
}
