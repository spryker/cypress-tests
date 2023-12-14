import 'reflect-metadata';
import { Repository } from '../repository';
import { injectable } from 'inversify';

@injectable()
export class SuiteRepository implements Repository {
  getQuickAddToCartSkuField = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.get('[name="sku"]');
  };

  getQuickAddToCartQuantityField = (): Cypress.Chainable<
    JQuery<HTMLElement>
  > => {
    return cy.get('#quantity');
  };

  getQuickAddToCartSubmitButton = (): Cypress.Chainable<
    JQuery<HTMLElement>
  > => {
    return cy.get('.js-product-quick-add-form__submit-button');
  };

  findCartItemRemovalForm = (
    sku: string
  ): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.get('[action]').filter((index, element) => {
      const regex = new RegExp(`^/\\w+/cart/remove/${sku}/\\w+$`);
      return regex.test(element.getAttribute('action') ?? '');
    });
  };

  findCartItemChangeQuantityForm = (
    sku: string
  ): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.get('[action]').filter((index, element) => {
      const regex = new RegExp(`^/\\w+/cart/change/${sku}$`);
      return regex.test(element.getAttribute('action') ?? '');
    });
  };

  getCartItemChangeQuantityField = (
    sku: string
  ): Cypress.Chainable<JQuery<HTMLElement>> => {
    return this.findCartItemChangeQuantityForm(sku).find(
      '[data-qa="component formatted-number-input"]'
    );
  };

  findClearCartForm = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.get('form[name=multi_cart_clear_form]');
  };

  getCheckoutButton = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.get('[data-qa="cart-go-to-checkout"]');
  };
}
