import { injectable } from 'inversify';
import { CartRepository } from '../cart-repository';

@injectable()
export class B2cCartRepository implements CartRepository {
  getQuickAddToCartSkuField = (): Cypress.Chainable =>
    cy.get('[data-qa="component product-quick-add-form"] input').first();
  getQuickAddToCartProductListField = (): Cypress.Chainable => cy.get('[data-qa="component products-list"]');
  getQuickAddToCartQuantityField = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('[data-qa="product-quick-add-form-quantity-input"]');
  getQuickAddToCartSubmitButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('[data-qa="product-quick-add-form-submit-button"]');
  findCartItemRemovalForm = (sku: string): Cypress.Chainable => {
    return cy.get('[action]').filter((index, element) => {
      if (Cypress.env('isDynamicStoreEnabled')) {
        const regex = new RegExp(`^/\\w+/\\w+/cart/async/remove/${sku}/\\w+`);
        return regex.test(element.getAttribute('action') ?? '');
      }
      const regex = new RegExp(`^/\\w+/cart/async/remove/${sku}/\\w+`);
      return regex.test(element.getAttribute('action') ?? '');
    });
  };
  findCartItemChangeQuantityForm = (sku: string): Cypress.Chainable => {
    return cy.get('[action]').filter((index, element) => {
      if (Cypress.env('isDynamicStoreEnabled')) {
        const regex = new RegExp(`^/\\w+/\\w+/cart/async/change-quantity/${sku}$`);
        return regex.test(element.getAttribute('action') ?? '');
      }
      const regex = new RegExp(`^/\\w+/cart/async/change-quantity/${sku}$`);
      return regex.test(element.getAttribute('action') ?? '');
    });
  };
  getCartItemChangeQuantityField = (sku: string): Cypress.Chainable =>
    this.findCartItemChangeQuantityForm(sku).find('[data-qa="quantity-counter"]');
  findClearCartForm = (): Cypress.Chainable => cy.get('[data-qa="multi-cart-clear-form"]');
  getCheckoutButton = (): Cypress.Chainable => cy.get('[data-qa="cart-go-to-checkout"]:visible');
  findCartItemRemovalSubmit = (sku: string): Cypress.Chainable => this.findCartItemRemovalForm(sku).find('button');
  getCartDiscountSummary = (): Cypress.Chainable => cy.get('[data-qa="component cart-discount-summary"]');
  getCartItemChangeQuantitySubmit = (sku: string): Cypress.Chainable =>
    this.findCartItemChangeQuantityForm(sku).find('[data-qa="quantity-input-submit"]');
  getCartSummary = (): Cypress.Chainable => cy.get('[data-qa="component cart-summary"]');
  getCustomOrderReferenceInput = (): Cypress.Chainable =>
    cy.get('[data-qa="component order-custom-reference-form"] input[type=text]');
  getCustomOrderReferenceSubmitButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component order-custom-reference-form"] button[type=submit]');
  getFirstCartItemNoteField = (): Cypress.Chainable =>
    cy.get('[data-qa="component form quote-item-cart-note-form"]').last().find('textarea').first();
  getFirstCartItemNoteSubmitButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component form quote-item-cart-note-form"] [data-qa="submit-button"]').last();
  submitCartItemChangeQuantity = (sku: string): void => {
    this.getCartItemChangeQuantityField(sku).type('{enter}', { force: true });
  };
  getCartItemSummaryBlock = (itemIndex: number): Cypress.Chainable =>
    cy.get('[data-qa="component cart-item-summary"]').eq(itemIndex);
  getCancelOrderAmendmentButton = (): Cypress.Chainable => cy.get('[data-qa="cancel-order-amendment-button"]');
}
