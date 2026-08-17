import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class WorkflowInstanceLifecycleRepository {
  getProcessTable = (): Cypress.Chainable => cy.get('table:visible');
  getProcessRow = (name: string): Cypress.Chainable =>
    this.getProcessTable().find('tbody tr:visible').filter(`:contains("${name}")`);
  getProcessRowVersionsButton = (name: string): Cypress.Chainable =>
    this.getProcessRow(name).find('a:contains("Versions")');
  getVersionRowInstancesButton = (): Cypress.Chainable =>
    this.getProcessTable().find('tbody tr:visible a:contains("Instances")').first();
  getInstanceRow = (identifier: number): Cypress.Chainable =>
    this.getProcessTable().find('tbody tr:visible').filter(`:contains("${identifier}")`).first();
  getInstanceRowState = (identifier: number): Cypress.Chainable =>
    this.getInstanceRow(identifier).find('[data-qa="workflow-instance-state"]');
  getInstanceRowStatus = (identifier: number): Cypress.Chainable =>
    this.getInstanceRow(identifier).find('[data-qa="workflow-instance-status"]');
  getInstanceRowManualAction = (identifier: number, eventName: string): Cypress.Chainable =>
    this.getInstanceRow(identifier).find(`[data-qa~="workflow-instance-manual-action"]:contains("${eventName}")`);
}
