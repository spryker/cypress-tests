export interface QuickOrderRepository {
  getVisualAddToCartForm(): Cypress.Chainable;
  getVisualAddToCartFileInput(): Cypress.Chainable;
  getVisualAddToCartDescription(): Cypress.Chainable;
  getVisualAddToCartUploadButton(): Cypress.Chainable;
}
