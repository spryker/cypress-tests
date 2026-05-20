import { injectable } from 'inversify';
import { CostCenterListRepository } from '../cost-center-list-repository';

@injectable()
export class SuiteCostCenterListRepository implements CostCenterListRepository {
  getCreateButton = (): Cypress.Chainable => cy.get('a[href*="cost-center/create"]');

  getTableRows = (): Cypress.Chainable => cy.get('[data-qa="component advanced-table"] tbody tr');

  getEditButtonByUuid = (uuid: string): Cypress.Chainable =>
    cy.get(`[data-qa="cell-actions"] a[href*="${uuid}"]`).first();

  getStatusBadgeByUuid = (uuid: string): Cypress.Chainable =>
    cy
      .get(`[data-qa="cell-actions"] a[href*="${uuid}"]`)
      .closest('tr')
      .find('[data-qa="cell-spy_cost_center.is_active"]');
}
