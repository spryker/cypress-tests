import { injectable } from 'inversify';
import { QuickOrderRepository } from '../quick-order-repository';

@injectable()
export class SuiteQuickOrderRepository implements QuickOrderRepository {
  getVisualAddToCartForm = (): Cypress.Chainable => cy.get('[data-qa="component quick-order-image-to-cart"]');
  getVisualAddToCartFileInput = (): Cypress.Chainable => cy.get('[data-qa="quick-order-image-to-cart-file-input"]');
  getVisualAddToCartDescription = (): Cypress.Chainable => cy.get('[data-qa="quick-order-image-to-cart-description"]');
  getVisualAddToCartUploadButton = (): Cypress.Chainable =>
    cy.get('[data-qa="quick-order-image-to-cart-upload-button"]');
}
