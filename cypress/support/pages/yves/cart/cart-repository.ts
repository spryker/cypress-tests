export interface CartRepository {
  getQuickAddToCartSkuField(): Cypress.Chainable;
  getQuickAddToCartProductListField(): Cypress.Chainable;
  getLastCartItemNoteField(): Cypress.Chainable;
  getLastCartItemNoteSubmitButton(): Cypress.Chainable;
  getQuickAddToCartQuantityField(): Cypress.Chainable;
  getQuickAddToCartSubmitButton(): Cypress.Chainable;
  findCartItemRemovalForm(sku: string): Cypress.Chainable;
  findCartItemChangeQuantityForm(sku: string): Cypress.Chainable;
  getCartItemChangeQuantityField(sku: string): Cypress.Chainable;
  findClearCartForm(): Cypress.Chainable;
  getCheckoutButton(): Cypress.Chainable;
  getCartUpsellingAjaxLoader(): Cypress.Chainable;
  getPageLayoutCartAjaxLoader(): Cypress.Chainable;
}
