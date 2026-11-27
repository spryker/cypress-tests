import { injectable } from 'inversify';
import { QuickOrderRepository } from '../quick-order-repository';

@injectable()
export class SuiteQuickOrderRepository implements QuickOrderRepository {
  getVisualAddToCartForm = (): Cypress.Chainable => cy.get('[data-qa="component quick-order-visual-add-to-cart"]');
  getVisualAddToCartFileInput = (): Cypress.Chainable =>
    cy.get('[data-qa="quick-order-visual-add-to-cart-file-input"]');
  getVisualAddToCartDescription = (): Cypress.Chainable =>
    cy.get('[data-qa="quick-order-visual-add-to-cart-description"]');
  getVisualAddToCartUploadButton = (): Cypress.Chainable =>
    cy.get('[data-qa="quick-order-visual-add-to-cart-upload-button"]');
}
