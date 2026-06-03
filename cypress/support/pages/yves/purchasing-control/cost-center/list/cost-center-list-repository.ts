export interface CostCenterListRepository {
  getCreateButton(): Cypress.Chainable;
  getTableRows(): Cypress.Chainable;
  getEditButtonByUuid(uuid: string): Cypress.Chainable;
  getStatusBadgeByUuid(uuid: string): Cypress.Chainable;
}
