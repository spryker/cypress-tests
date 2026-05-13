import { injectable } from 'inversify';
import { BudgetListRepository } from '../budget-list-repository';

@injectable()
export class SuiteBudgetListRepository implements BudgetListRepository {
  getCreateButton = (): Cypress.Chainable => cy.get('a[href*="budget/create"]');

  getTableRows = (): Cypress.Chainable => cy.get('[data-qa="component data-table"] tbody tr');

  getEditButtonByUuid = (uuid: string): Cypress.Chainable =>
    cy.get(`[data-qa="cell-actions"] a[href*="${uuid}"]`).first();
}
