import { injectable } from 'inversify';
import { CartRepository } from '../cart-repository';

@injectable()
export class B2cCartRepository implements CartRepository {
  // The approver's actions live on the cart page, not the summary, and put the approval's id at
  // the end of the path - /quote-approval/approve/8 - the opposite way round to the requester's
  // cancel form. A cart waiting for approval is also locked, which the reset-lock form marks.
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
    this.findCartItemChangeQuantityForm(sku).find('[data-qa="component quantity-counter"] input:visible');
  findClearCartForm = (): Cypress.Chainable => cy.get('[data-qa="multi-cart-clear-form"]');
  getCheckoutButton = (): Cypress.Chainable => cy.get('[data-qa="cart-go-to-checkout"]:visible');
  findCartItemRemovalSubmit = (sku: string): Cypress.Chainable => this.findCartItemRemovalForm(sku).find('button');
  getCartDiscountSummary = (): Cypress.Chainable => cy.get('[data-qa="component cart-discount-summary"]');
  // Scoped to one tile by sku, because any other active promotion discount offers its own product
  // in the same carousel. The tile shows the product name only; the sku is in its group key input.
  getPromotionalProductAddToCartButton = (sku: string): Cypress.Chainable =>
    cy.get(
      `[data-qa="component product-item"]:has(input[name="groupKey"][value="${sku}"]) [data-qa="add-to-cart-button"]`
    );
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
  addFirstCartItemNote = (message: string): void => {
    this.getFirstCartItemNoteField().type(message);
  };
  submitFirstCartItemNote = (): void => {
    this.getFirstCartItemNoteSubmitButton().click();
  };
  submitCartItemChangeQuantity = (sku: string): void => {
    this.getCartItemChangeQuantityField(sku).type('{enter}', { force: true });
  };
  getCartItemSummaryBlock = (itemIndex: number): Cypress.Chainable =>
    cy.get('[data-qa="component product-card-item"]').eq(itemIndex);
  getCancelOrderAmendmentButton = (): Cypress.Chainable => cy.get('[data-qa="cancel-order-amendment-button"]');
  // The header's mini cart renders the same component for every line, marked with its mini-cart modifier.
  getProductCartItems = (): Cypress.Chainable =>
    cy.get('[data-qa="component product-card-item"]:not(.product-card-item--mini-cart)');
  getCartItemsListTitles = (): Cypress.Chainable =>
    cy.get('[data-qa="component product-card-item"] [data-qa="product-title"]');
  getCartItemAvailabilityLabel = (): Cypress.Chainable =>
    cy.get('[data-qa="component product-cart-item"] [data-qa="component availability-product"]');
  getConfiguredBundles = (): Cypress.Chainable => cy.get('article[data-qa*="configured-bundle-secondary"]');
  getConfiguredBundle = (bundleName: string): Cypress.Chainable =>
    cy.contains('article[data-qa*="configured-bundle-secondary"]', bundleName).first();
  // The bundle's quantity counter has no submit button: it submits its form itself a moment after the value
  // changes, so the form is submitted directly instead of waiting on that timer.
  changeConfiguredBundleQuantity = (bundleName: string, quantity: number): void => {
    const input = this.getConfiguredBundle(bundleName).find('input.formatted-number-input__input').first();

    input.type('{selectall}', { force: true });
    input.type(String(quantity), { force: true });
    this.getConfiguredBundle(bundleName).find('form[action*="configured-bundle/change"]').first().submit();
  };
  getClearCartFormSelector = (): string => '[data-qa="multi-cart-clear-form"]';

  getConfigureButtonSelector = (): string => '[data-qa="component configuration-cart-form"] button';
  getCartItemRemovalFormSelector = (): string => 'form[name^="removeFromCartForm_"]';
  getCartItemQuantityInputSelector = (): string => '[data-qa="component quantity-counter"] input:visible';
}
