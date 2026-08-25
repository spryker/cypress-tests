import { injectable } from 'inversify';
import { CartRepository } from '../cart-repository';

@injectable()
export class B2cMpCartRepository implements CartRepository {
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
  getQuickAddToCartSkuField = (): Cypress.Chainable =>
    cy.get('[data-qa="component product-quick-add-form"] input').first();
  getQuickAddToCartProductListField = (): Cypress.Chainable => cy.get('[data-qa="component products-list"]');
  getFirstCartItemNoteField = (): Cypress.Chainable =>
    cy.get('[data-qa="component form quote-item-cart-note-form"]').last().find('textarea').first();
  getFirstCartItemNoteSubmitButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component form quote-item-cart-note-form"] [data-qa="submit-button"]').last();
  addFirstCartItemNote = (message: string): void => {
    this.getFirstCartItemNoteField().type(message);
  };
  submitFirstCartItemNote = (): void => {
    this.getFirstCartItemNoteSubmitButton().click();
  };
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
    this.findCartItemChangeQuantityForm(sku).find('[data-qa="component quantity-counter"] input:visible');
  getCartItemChangeQuantitySubmit = (sku: string): Cypress.Chainable =>
    this.findCartItemChangeQuantityForm(sku).find('[data-qa="quantity-input-submit"]');
  findClearCartForm = (): Cypress.Chainable => cy.get('[data-qa="multi-cart-clear-form"]');
  getCheckoutButton = (): Cypress.Chainable => cy.get('[data-qa="cart-go-to-checkout"]:visible');
  getCartSummary = (): Cypress.Chainable => cy.get('[data-qa="component cart-summary"]');
  getCartDiscountSummary = (): Cypress.Chainable => cy.get('[data-qa="component cart-discount-summary"]');
  getCustomOrderReferenceInput = (): Cypress.Chainable =>
    cy.get('[data-qa="component order-custom-reference-form"] input[type=text]');
  getCustomOrderReferenceSubmitButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component order-custom-reference-form"] button[type=submit]');
  submitCartItemChangeQuantity = (sku: string): void => {
    this.getCartItemChangeQuantityField(sku).type('{enter}', { force: true });
  };
  getCartItemSummaryBlock = (itemIndex: number): Cypress.Chainable =>
    cy.get('[data-qa="component product-card-item"]').eq(itemIndex);
  getCancelOrderAmendmentButton = (): Cypress.Chainable => cy.get('[data-qa="cancel-order-amendment-button"]');
  getProductCartItems = (): Cypress.Chainable => cy.get('[data-qa="component product-card-item"]');
  getCartItemsListTitles = (): Cypress.Chainable =>
    cy.get('[data-qa="component product-card-item"] [data-qa="product-title"]');
  getCartItemAvailabilityLabel = (): Cypress.Chainable =>
    cy.get('[data-qa="component product-cart-item"] [data-qa="component availability-product"]');
  getConfiguredBundles = (): Cypress.Chainable => cy.get('article[data-qa*="configured-bundle-secondary"]');
  getConfiguredBundle = (bundleName: string): Cypress.Chainable =>
    cy.contains('article[data-qa*="configured-bundle-secondary"]', bundleName).first();
  getConfiguredBundleQuantityField = (bundleName: string): Cypress.Chainable =>
    this.getConfiguredBundle(bundleName).find('input.formatted-number-input__input').first();
  submitConfiguredBundleQuantity = (bundleName: string): void => {
    this.getConfiguredBundle(bundleName).find('[data-qa="quantity-input-submit"]').first().click({ timeout: 10000 });
  };
  getClearCartFormSelector = (): string => '[data-qa="multi-cart-clear-form"]';
}
