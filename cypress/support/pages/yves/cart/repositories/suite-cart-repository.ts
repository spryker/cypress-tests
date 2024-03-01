import 'reflect-metadata';
import { injectable } from 'inversify';
import { CartRepository } from '../cart-repository';

@injectable()
export class SuiteCartRepository implements CartRepository {
  getQuickAddToCartSkuField = (): Cypress.Chainable =>
    cy.get('[data-qa="component product-quick-add-form"] input').first();
  getQuickAddToCartProductListField = (): Cypress.Chainable => cy.get('[data-qa="component products-list"]');
  getQuickAddToCartQuantityField = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('[data-qa="product-quick-add-form-quantity-input"]');
  getQuickAddToCartSubmitButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('[data-qa="product-quick-add-form-submit-button"]');
  findCartItemRemovalForm = (sku: string): Cypress.Chainable => {
    return cy.get('[action]').filter((index, element) => {
      const regex = new RegExp(`^/\\w+/cart/remove/${sku}/\\w+$`);
      return regex.test(element.getAttribute('action') ?? '');
    });
  };
  findCartItemChangeQuantityForm = (sku: string): Cypress.Chainable => {
    return cy.get('[action]').filter((index, element) => {
      const regex = new RegExp(`^/\\w+/cart/change/${sku}$`);
      return regex.test(element.getAttribute('action') ?? '');
    });
  };
  getCartItemChangeQuantityField = (sku: string): Cypress.Chainable =>
    this.findCartItemChangeQuantityForm(sku).find('[data-qa="cart-item-quantity-input"]');
  findClearCartForm = (): Cypress.Chainable => cy.get('[data-qa="multi-cart-clear-form"]');
  getCheckoutButton = (): Cypress.Chainable => cy.get('[data-qa="cart-go-to-checkout"]');
}
