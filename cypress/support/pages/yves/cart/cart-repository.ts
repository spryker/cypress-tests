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
  getCartUpsellingAjaxLoader(): Cypress.Chainable;
  getPageLayoutCartAjaxLoader(): Cypress.Chainable;
  getCartSummary(): Cypress.Chainable;
  getCartCounter(): Cypress.Chainable;
}
