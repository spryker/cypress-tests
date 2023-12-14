export interface Repository {
  getQuickAddToCartSkuField(): Cypress.Chainable<JQuery<HTMLElement>>;
  getQuickAddToCartQuantityField(): Cypress.Chainable<JQuery<HTMLElement>>;
  getQuickAddToCartSubmitButton(): Cypress.Chainable<JQuery<HTMLElement>>;
  findCartItemRemovalForm(sku: string): Cypress.Chainable<JQuery<HTMLElement>>;
  findCartItemChangeQuantityForm(
    sku: string
  ): Cypress.Chainable<JQuery<HTMLElement>>;
  getCartItemChangeQuantityField(
    sku: string
  ): Cypress.Chainable<JQuery<HTMLElement>>;
  findClearCartForm(): Cypress.Chainable<JQuery<HTMLElement>>;
  getCheckoutButton(): Cypress.Chainable<JQuery<HTMLElement>>;
}
