import { injectable } from 'inversify';
import { BudgetListRepository } from '../budget-list-repository';

@injectable()
export class SuiteBudgetListRepository implements BudgetListRepository {
  getCreateButton = (): Cypress.Chainable => cy.get('[data-qa="create-budget-button"]');

  getTableRows = (): Cypress.Chainable => cy.get('[data-qa="component advanced-table"] tbody tr');

  getEditButtonByUuid = (uuid: string): Cypress.Chainable =>
    cy.get(`[data-qa="cell-actions"] a[href*="${uuid}"]`).first();
}
