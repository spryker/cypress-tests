export interface OrderDetailsRepository {
  getReorderAllButton(): Cypress.Chainable;
  getOrderReferenceBlock(): Cypress.Chainable;
  getReorderSelectedItemsButton(): Cypress.Chainable;
  getCartReorderItemCheckboxes(): Cypress.Chainable;
  getEditOrderButton(): Cypress.Chainable;
}
