import { injectable } from 'inversify';
import { CartRepository } from '../cart-repository';

@injectable()
export class B2bMpCartRepository implements CartRepository {
  // The approver's actions live on the cart page, not the summary, and put the approval's id at
  // the end of the path - /quote-approval/approve/8 - the opposite way round to the requester's
  // cancel form. A cart waiting for approval is also locked, which the reset-lock form marks.
  getApproveCartButton = (): Cypress.Chainable => cy.get('form[action*="/quote-approval/approve/"]').find('button');
  getLockedCartResetForm = (): Cypress.Chainable => cy.get('form[action$="/cart/reset-lock"]');
  getApprovalStatus = (): Cypress.Chainable => cy.get('.quote-status');
  // The share widget renders one url-mask-generator per share option group. Clicking the group's
  // toggler fires the cart/create-link AJAX, which renders the generated link into an input whose
  // id is the share option - PREVIEW for the external group.
  getExternalCartShareToggle = (): Cypress.Chainable =>
    cy.get('url-mask-generator[shareoptiongroup="external"]').find('.js-toggler-radio__trigger');
  getExternalCartShareLinkInput = (): Cypress.Chainable => cy.get('#PREVIEW');
  getQuickAddToCartSkuField = (): Cypress.Chainable => cy.get('[data-qa="component autocomplete-form"] .input');
  getQuickAddToCartProductListField = (): Cypress.Chainable => cy.get('[data-qa="component products-list"]');
  getFirstCartItemNoteField = (): Cypress.Chainable => {
    cy.get('[data-qa="component cart-item-note"]')
      .last()
      .find('textarea')
      .first()
      .then(($textarea) => {
        if (!$textarea.is(':visible')) {
          cy.get('[data-qa="component product-cart-item"]')
            .first()
            .find('.product-cart-item__context-item[data-trigger-target*="cart-item-note"]')
            .click();
        }
      });

    return cy.get('[data-qa="component cart-item-note"]').last().find('textarea').first();
  };
  getFirstCartItemNoteSubmitButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component cart-item-note"] [data-qa="submit-button"]').last();
  addFirstCartItemNote = (message: string): void => {
    this.getFirstCartItemNoteField().clear().type(message);
  };
  submitFirstCartItemNote = (): void => {
    cy.intercept('POST', '**/cart-note/**').as('cartNoteSave');
    cy.intercept('GET', '**/cart/async/view').as('cartAsyncView');
    this.getFirstCartItemNoteSubmitButton().click();
    cy.wait('@cartNoteSave', { timeout: 10000 });
    cy.wait('@cartAsyncView', { timeout: 10000 });
  };
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
  getProductCartItems = (): Cypress.Chainable => {
    if (Cypress.env('ENV_IS_SSP_ENABLED')) {
      return cy.get('[data-qa="component product-cart-item"]');
    }
    return cy.get('[data-qa="component product-card-item"]');
  };
  getCartItemsListTitles = (): Cypress.Chainable => {
    if (Cypress.env('ENV_IS_SSP_ENABLED')) {
      return cy.get('[data-qa="cart-item-title"]');
    }
    return cy.get('[data-qa="component product-card-item"] [data-qa="product-title"]');
  };
  getCartItemAvailabilityLabel = (): Cypress.Chainable =>
    cy.get('[data-qa="component product-cart-item"] [data-qa="component status"]');
  getConfiguredBundles = (): Cypress.Chainable => cy.get('article[data-qa*="configured-bundle"]');
  getConfiguredBundle = (bundleName: string): Cypress.Chainable =>
    cy.contains('article[data-qa*="configured-bundle"]', bundleName).first();
  getConfiguredBundleQuantityField = (bundleName: string): Cypress.Chainable =>
    this.getConfiguredBundle(bundleName).find('input.formatted-number-input__input').first();
  submitConfiguredBundleQuantity = (bundleName: string): void => {
    this.getConfiguredBundle(bundleName).find('[data-qa="quantity-input-submit"]').first().click({ timeout: 10000 });
  };
  getClearCartFormSelector = (): string => 'form[name=multi_cart_clear_form]';

  getConfigureButtonSelector = (): string => '[data-qa="component configuration-cart-form"] button';
}
