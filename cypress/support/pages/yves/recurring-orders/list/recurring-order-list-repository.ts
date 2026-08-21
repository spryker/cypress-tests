export interface RecurringOrderListRepository {
  getViewButton(): Cypress.Chainable;
  getListTable(): Cypress.Chainable;
  getAttentionBanner(): Cypress.Chainable;
}
