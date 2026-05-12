import { injectable } from 'inversify';
import { CostCenterListRepository } from '../cost-center-list-repository';

@injectable()
export class SuiteCostCenterListRepository implements CostCenterListRepository {
  getCreateButton = (): Cypress.Chainable => cy.get('[data-qa="create-cost-center-button"]');

  getTableRows = (): Cypress.Chainable => cy.get('[data-qa="component advanced-table"] tbody tr');

  getEditButtonByUuid = (uuid: string): Cypress.Chainable =>
    cy.get(`[data-qa="cell-actions"] a[href*="${uuid}"]`).first();

  getStatusBadgeByUuid = (uuid: string): Cypress.Chainable =>
    cy.get(`tr:has(a[href*="${uuid}"]) [data-qa="cell-spy_cost_center.is_active"]`);
}
