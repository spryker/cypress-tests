import { injectable } from 'inversify';
import { CartRepository } from '../cart-repository';

@injectable()
export class B2bCartRepository implements CartRepository {
  getQuickAddToCartSkuField = (): Cypress.Chainable => cy.get('[data-qa="component autocomplete-form"] .input');
  getQuickAddToCartProductListField = (): Cypress.Chainable => cy.get('[data-qa="component products-list"]');
  getFirstCartItemNoteField = (): Cypress.Chainable =>
    cy.get('[data-qa="component form quote-item-cart-note-form"]').last().find('textarea').first();
  getFirstCartItemNoteSubmitButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component form quote-item-cart-note-form"] [data-qa="submit-button"]').last();
  getQuickAddToCartQuantityField = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#quantity');
  getQuickAddToCartSubmitButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('.product-quick-add-form__button');
  findCartItemRemovalForm = (sku: string): Cypress.Chainable => {
    return cy.get('[action]').filter((index, element) => {
      const regex = new RegExp(`^/\\w+/cart/remove/${sku}/\\w+$`);
      return regex.test(element.getAttribute('action') ?? '');
    });
  };
  findCartItemRemovalSubmit = (sku: string): Cypress.Chainable => this.findCartItemRemovalForm(sku).find('button');
  findCartItemChangeQuantityForm = (sku: string): Cypress.Chainable => {
    return cy.get('[action]').filter((index, element) => {
      const regex = new RegExp(`^/\\w+/cart/change/${sku}$`);
      return regex.test(element.getAttribute('action') ?? '');
    });
  };
  getCartItemChangeQuantityField = (sku: string): Cypress.Chainable =>
    this.findCartItemChangeQuantityForm(sku).find('[data-qa="component formatted-number-input"]');
  getCartItemChangeQuantitySubmit = (sku: string): Cypress.Chainable =>
    this.findCartItemChangeQuantityForm(sku).find('[data-qa="quantity-input-submit"]');
  findClearCartForm = (): Cypress.Chainable => cy.get('form[name=multi_cart_clear_form]');
  getCheckoutButton = (): Cypress.Chainable => cy.get('[data-qa="cart-go-to-checkout"]');
  getCartUpsellingAjaxLoader = (): Cypress.Chainable =>
    cy.get('[data-qa="component cart-upselling"] [data-qa="component ajax-loader"]', { timeout: 10000 });
  getPageLayoutCartAjaxLoader = (): Cypress.Chainable =>
    cy.get('[data-qa="component ajax-loader page-layout-cart-ajax-loader"]', { timeout: 10000 });
  getCartSummary = (): Cypress.Chainable => cy.get('[data-qa="component cart-summary"]');
  getCartDiscountSummary = (): Cypress.Chainable => cy.get('[data-qa="component cart-discount-summary"]');
}
