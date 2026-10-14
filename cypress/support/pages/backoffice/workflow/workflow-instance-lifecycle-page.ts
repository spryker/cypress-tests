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
    this.repository.getProcessRowViewButton(workflowName).click();
    // No page links to the instances list, so it is opened with the version id read from the version view URL.
    cy.location('search').then((search: string): void => {
      const idDefinition = new URLSearchParams(search).get('id-definition');

      cy.visitBackoffice(`/workflow/instance?id-definition=${idDefinition}`);
    });
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
