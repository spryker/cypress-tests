export interface BudgetListRepository {
  getCreateButton(): Cypress.Chainable;
  getTableRows(): Cypress.Chainable;
  getEditButtonByUuid(uuid: string): Cypress.Chainable;
}
