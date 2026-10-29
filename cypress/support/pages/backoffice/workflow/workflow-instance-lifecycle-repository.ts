import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class WorkflowInstanceLifecycleRepository {
  getProcessTable = (): Cypress.Chainable => cy.get('table:visible');
  getProcessRow = (name: string): Cypress.Chainable =>
    this.getProcessTable().find('tbody tr:visible').filter(`:contains("${name}")`);
  getProcessRowViewButton = (name: string): Cypress.Chainable => this.getProcessRow(name).find('a:contains("View")');
  getWorkflowActivityTable = (): Cypress.Chainable => cy.get('[data-qa="workflow-activity"] table:visible');
  getWorkflowActivityHeaders = (): Cypress.Chainable => this.getWorkflowActivityTable().find('thead th');
  getInstanceRow = (identifier: number): Cypress.Chainable =>
    this.getWorkflowActivityTable().find('tbody tr:visible').filter(`:contains("${identifier}")`).first();
  getInstanceRowState = (identifier: number): Cypress.Chainable =>
    this.getInstanceRow(identifier).find('[data-qa="workflow-instance-state"]');
  getInstanceRowStatus = (identifier: number): Cypress.Chainable =>
    this.getInstanceRow(identifier).find('[data-qa="workflow-instance-status"]');
  getInstanceRowViewButton = (identifier: number): Cypress.Chainable =>
    this.getInstanceRow(identifier).find('[data-qa="workflow-instance-view"]');
  getInstanceBackButton = (): Cypress.Chainable => cy.get('[data-qa="workflow-instance-back"]');
  getInstanceCurrentState = (): Cypress.Chainable => cy.get('[data-qa="workflow-instance-current-state"]');
  getInstanceManualActions = (): Cypress.Chainable => cy.get('[data-qa="workflow-instance-manual-action"]');
  getInstanceManualAction = (eventName: string): Cypress.Chainable =>
    this.getInstanceManualActions().filter(`:contains("${eventName}")`);
  getPageActionButtons = (): Cypress.Chainable => cy.get('.title-action').find('a, button');
  getInstanceRowManualAction = (identifier: number, eventName: string): Cypress.Chainable =>
    this.getInstanceRow(identifier).find(`[data-qa~="workflow-instance-manual-action"]:contains("${eventName}")`);
}
