import { injectable } from 'inversify';
import { CartRepository } from '../cart-repository';

@injectable()
export class SuiteCartRepository implements CartRepository {
  getQuickAddToCartSkuField = (): Cypress.Chainable =>
    cy.get('[data-qa="component product-quick-add-form"] input').first();
  getQuickAddToCartProductListField = (): Cypress.Chainable => cy.get('[data-qa="component products-list"]');
  getFirstCartItemNoteField = (): Cypress.Chainable =>
    cy.get('[data-qa="component form quote-item-cart-note-form"]').first().find('textarea').first();
  getFirstCartItemNoteSubmitButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component form quote-item-cart-note-form"] [data-qa="submit-button"]').first();
  getQuickAddToCartQuantityField = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('[data-qa="product-quick-add-form-quantity-input"]');
  getQuickAddToCartSubmitButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('[data-qa="product-quick-add-form-submit-button"]');
  findCartItemRemovalForm = (sku: string): Cypress.Chainable => {
    return cy.get('[action]').filter((index, element) => {
      const regex = new RegExp(`^/\\w+/cart/async/remove/${sku}/\\w+$`);
      return regex.test(element.getAttribute('action') ?? '');
    });
  };
  findCartItemRemovalSubmit = (sku: string): Cypress.Chainable => this.findCartItemRemovalForm(sku).find('button');
  findCartItemChangeQuantityForm = (sku: string): Cypress.Chainable => {
    return cy.get('[action]').filter((index, element) => {
      const regex = new RegExp(`^/\\w+/cart/async/change-quantity/${sku}$`);
      return regex.test(element.getAttribute('action') ?? '');
    });
  };
  getCartItemChangeQuantityField = (sku: string): Cypress.Chainable =>
    this.findCartItemChangeQuantityForm(sku).find('[data-qa="cart-item-quantity-input"]');
  getCartItemChangeQuantitySubmit = (sku: string): Cypress.Chainable =>
    this.findCartItemChangeQuantityForm(sku).find('[data-qa="quantity-input-submit"]');
  findClearCartForm = (): Cypress.Chainable => cy.get('[data-qa="multi-cart-clear-form"]');
  getCheckoutButton = (): Cypress.Chainable => cy.get('[data-qa="cart-go-to-checkout"]');
  getCartUpsellingAjaxLoader = (): Cypress.Chainable =>
    cy.get('[data-qa="component cart-upselling"] [data-qa="component ajax-loader"]', { timeout: 10000 });
  getPageLayoutCartAjaxLoader = (): Cypress.Chainable =>
    cy.get('[data-qa="component ajax-loader page-layout-cart-ajax-loader"]', { timeout: 10000 });
  getCartSummary = (): Cypress.Chainable => cy.get('[data-qa="component cart-summary"]');
  getCartCounter = (): Cypress.Chainable => cy.get('[data-qa="component cart-counter"]');
}
