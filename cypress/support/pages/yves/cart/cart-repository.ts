export interface CartRepository {
  getQuickAddToCartSkuField(): Cypress.Chainable;
  getQuickAddToCartProductListField(): Cypress.Chainable;
  getFirstCartItemNoteField(): Cypress.Chainable;
  getFirstCartItemNoteSubmitButton(): Cypress.Chainable;
  getQuickAddToCartQuantityField(): Cypress.Chainable;
  getQuickAddToCartSubmitButton(): Cypress.Chainable;
  findCartItemRemovalForm(sku: string): Cypress.Chainable;
  findCartItemRemovalSubmit(sku: string): Cypress.Chainable;
  findCartItemChangeQuantityForm(sku: string): Cypress.Chainable;
  getCartItemChangeQuantityField(sku: string): Cypress.Chainable;
  getCartItemChangeQuantitySubmit(sku: string): Cypress.Chainable;
  findClearCartForm(): Cypress.Chainable;
  getCheckoutButton(): Cypress.Chainable;
  getCartSummary(): Cypress.Chainable;
  getCartDiscountSummary(): Cypress.Chainable;
  getCustomOrderReferenceInput(): Cypress.Chainable;
  getCustomOrderReferenceSubmitButton(): Cypress.Chainable;
  submitCartItemChangeQuantity(sku: string): void;
  getCartItemSummaryBlock(itemIndex: number): Cypress.Chainable;
  getCancelOrderAmendmentButton(): Cypress.Chainable;
  getProductCartItems(): Cypress.Chainable;
  getCartItemsListTitles(): Cypress.Chainable;
}
