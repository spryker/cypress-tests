export interface OrderDetailsRepository {
  getReorderAllButton(): Cypress.Chainable;
  getOrderReferenceBlock(): Cypress.Chainable;
  getReorderSelectedItemsButton(): Cypress.Chainable;
  getCartReorderItemCheckboxes(): Cypress.Chainable;
  getEditOrderButton(): Cypress.Chainable;
  getEditOrderConfirmButton(): Cypress.Chainable;
  getEditOrderForm(): Cypress.Chainable;
  getOrderDetailTableBlock(): Cypress.Chainable;

  // OrderCancelButtonWidget renders its form only while every item of the order sits in a
  // cancellable state, so the button is absent from the DOM rather than hidden.
  getCancelOrderButton(): Cypress.Chainable;
}
