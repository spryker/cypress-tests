export interface CartRepository {
  getLockedCartResetForm(): Cypress.Chainable;
  getApprovalStatus(): Cypress.Chainable;
  getExternalCartShareToggle(): Cypress.Chainable;
  getExternalCartShareLinkInput(): Cypress.Chainable;
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
  getClearCartFormSelector(): string;
  getCartItemRemovalFormSelector(): string;

  // The cart line's own configure form. It is a different component from the detail page's, so the
  // detail-page selector does not find it.
  getConfigureButtonSelector(): string;
  getCheckoutButton(): Cypress.Chainable;
  getCartSummary(): Cypress.Chainable;
  getCartDiscountSummary(): Cypress.Chainable;
  getPromotionalProductAddToCartButton(sku: string): Cypress.Chainable;
  getCustomOrderReferenceInput(): Cypress.Chainable;
  getCustomOrderReferenceSubmitButton(): Cypress.Chainable;
  addFirstCartItemNote(message: string): void;
  submitFirstCartItemNote(): void;
  submitCartItemChangeQuantity(sku: string): void;
  getCartItemSummaryBlock(itemIndex: number): Cypress.Chainable;
  getCancelOrderAmendmentButton(): Cypress.Chainable;
  getProductCartItems(): Cypress.Chainable;
  getCartItemsListTitles(): Cypress.Chainable;
  getCartItemAvailabilityLabel(): Cypress.Chainable;
  getConfiguredBundles(): Cypress.Chainable;
  changeConfiguredBundleQuantity(bundleName: string, quantity: number): void;
}
