export interface OrderRepository {
  getOrderBusinessUnitFilter(): Cypress.Chainable;
  getOrderFilterApplyButton(): Cypress.Chainable;
  getEditOrderButton(): Cypress.Chainable;
  getEditOrderConfirmButton(): Cypress.Chainable;
}
