import { injectable } from 'inversify';
import { CartRepository } from '../cart-repository';

@injectable()
export class B2bCartRepository implements CartRepository {
  getQuickAddToCartSkuField = (): Cypress.Chainable => cy.get('[data-qa="component autocomplete-form"] .input');
  getQuickAddToCartProductListField = (): Cypress.Chainable => cy.get('[data-qa="component products-list"]');
  getFirstCartItemNoteField = (): Cypress.Chainable => {
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-qa="component cart-item-note"]')
      .children()
      .first()
      .click()
      .then(() => {
        // Check if the textarea has become visible
        cy.get('[data-qa="component cart-item-note"]')
          .last()
          .find('textarea')
          .first()
          .then(($textarea) => {
            if ($textarea.is(':visible')) {
              return;
            } else {
              cy.get('[data-qa="component cart-item-note"]').children().find('[title="edit"]').click();
            }
          });
      });

    return cy.get('[data-qa="component cart-item-note"]').last().find('textarea').first();
  };
  getFirstCartItemNoteSubmitButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component cart-item-note"] [data-qa="submit-button"]').last();
  getQuickAddToCartQuantityField = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#quantity');
  getQuickAddToCartSubmitButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get('.product-quick-add-form__button');
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
  findCartItemRemovalSubmit = (sku: string): Cypress.Chainable => this.findCartItemRemovalForm(sku).find('button');
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
    this.findCartItemChangeQuantityForm(sku).find('[data-qa="quantity-input"]');
  getCartItemChangeQuantitySubmit = (sku: string): Cypress.Chainable =>
    this.findCartItemChangeQuantityForm(sku).find('[data-qa="quantity-input-submit"]');
  findClearCartForm = (): Cypress.Chainable => cy.get('form[name=multi_cart_clear_form]');
  getCheckoutButton = (): Cypress.Chainable => cy.get('[data-qa="cart-go-to-checkout"]');
  getCartSummary = (): Cypress.Chainable => cy.get('[data-qa="component cart-summary"]');
  getCartDiscountSummary = (): Cypress.Chainable => cy.get('[data-qa="component cart-code-summary"]');
  getCustomOrderReferenceInput = (): Cypress.Chainable => {
    cy.get('[data-qa="component order-custom-reference-form"]').parent().parent().parent().click();

    return cy.get('[data-qa="component order-custom-reference-form"] input[type=text]');
  };
  getCustomOrderReferenceSubmitButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component order-custom-reference-form"] button[type=submit]');
  submitCartItemChangeQuantity = (sku: string): void => {
    const input = this.getCartItemChangeQuantityField(sku);

    input.type('{enter}', { force: true });
    input.parent().trigger('change');
  };
  getCartItemSummaryBlock = (itemIndex: number): Cypress.Chainable =>
    cy.get('[data-qa="cart-item-summary"]').eq(itemIndex);
  getCancelOrderAmendmentButton = (): Cypress.Chainable => cy.get('[data-qa="cancel-order-amendment-button"]');
  getProductCartItems = (): Cypress.Chainable => cy.get('[data-qa="component product-card-item"]');
  getCartItemsListTitles = (): Cypress.Chainable =>
    cy.get('[data-qa="component product-card-item"] [data-qa="product-title"]');
}
