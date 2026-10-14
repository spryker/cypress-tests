import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CartRepository } from './cart-repository';

@injectable()
@autoWired
export class CartPage extends YvesPage {
  @inject(REPOSITORIES.CartRepository) private repository: CartRepository;

  protected PAGE_URL = '/cart';

  quickAddToCart = (params: QuickAddToCartParams): void => {
    this.repository.getQuickAddToCartSkuField().clear({ timeout: 10000 });
    this.repository.getQuickAddToCartSkuField().type(params.sku);
    this.repository.getQuickAddToCartProductListField().click();

    this.repository
      .getQuickAddToCartQuantityField()
      .clear()
      .type(String(params?.quantity || 1));

    this.repository.getQuickAddToCartSubmitButton().click();
  };

  // The code field belongs to CartCodeWidget's form, not the DiscountWidget voucher form, and takes
  // gift-card codes as well as vouchers. Its id is the one the Robot source used for every shop, so
  // it is addressed here rather than per repository. The field sits inside a collapsible section, so
  // the interaction is forced rather than expanding it first. The code is redeemed asynchronously and
  // the cart re-renders behind a loader afterwards, so this waits for both before the cart is read.
  applyVoucherCode = (code: string): void => {
    cy.intercept({ method: 'POST', pathname: '**/cart-code/code-async/add' }).as('voucherCodeAdd');
    cy.intercept({ method: 'GET', pathname: '**/cart/async/view' }).as('cartAsyncView');

    cy.get('#cartCodeForm_code').clear({ force: true });
    cy.get('#cartCodeForm_code').type(code, { force: true });
    cy.get('form[name="cartCodeForm"]').find('button[data-qa="submit-button"]').click({ force: true });

    cy.wait('@voucherCodeAdd');
    cy.wait('@cartAsyncView');
  };

  // Scoped to one tile by sku, because any other active promotion discount offers its own product
  // in the same carousel.
  getPromotionalProduct = (sku: string): Cypress.Chainable => cy.contains('[data-qa="component product-item"]', sku);

  // Added asynchronously like a redeemed code, so this waits for the add and the cart re-render.
  addPromotionalProduct = (sku: string): void => {
    cy.intercept({ method: 'POST', pathname: `**/cart/async/add/${sku}` }).as('promotionalProductAdd');
    cy.intercept({ method: 'GET', pathname: '**/cart/async/view' }).as('cartAsyncView');

    this.getPromotionalProduct(sku).find('[data-qa="add-to-cart-button"]').click();

    cy.wait('@promotionalProductAdd');
    cy.wait('@cartAsyncView');
  };

  getExternalCartShareLink = (): Cypress.Chainable<string> => {
    this.repository.getExternalCartShareToggle().click({ force: true });

    return this.repository.getExternalCartShareLinkInput().invoke('val');
  };

  approveCart = (): void => {
    this.repository.getApproveCartButton().click();
  };

  getLockedCartResetForm = (): Cypress.Chainable => this.repository.getLockedCartResetForm();

  getApprovalStatus = (): Cypress.Chainable => this.repository.getApprovalStatus();

  startCheckout = (): void => {
    this.repository.getCheckoutButton().click({ force: true });
  };

  removeProduct = (params: RemoveProductParams): void => {
    const cartItemRemovalButton = this.repository.findCartItemRemovalSubmit(params.sku);

    if (!cartItemRemovalButton) {
      return;
    }

    cartItemRemovalButton.click({ timeout: 10000 });
  };

  changeQuantity = (params: ChangeQuantityParams): void => {
    const input = this.repository.getCartItemChangeQuantityField(params.sku);

    if (!input) {
      return;
    }

    input.type('{selectall}', { force: true }).type(String(params.quantity), { force: true });
    this.repository.submitCartItemChangeQuantity(params.sku);
  };

  // cy.get() on the clear form fails outright on an empty cart, so a spec that only needs a known
  // starting point has to look before it clears.
  configureProduct = (params: ConfigureProductParams): void => {
    this.repository
      .getProductCartItems()
      .filter(`:contains("${params.sku}")`)
      .first()
      .find(this.repository.getConfigureButtonSelector())
      .click();
  };

  clearCartIfNotEmpty = (): void => {
    this.getBody().then(($body) => {
      if ($body.find(this.repository.getClearCartFormSelector()).length) {
        this.clearCart();
      }
    });
  };

  clearCart = (): void => {
    const form = this.repository.findClearCartForm();

    if (form) {
      form.submit();
    }
  };

  addFirstCartItemNote = (params: CartItemNoteAddParams): void => {
    this.repository.addFirstCartItemNote(params.message);
  };

  clearFirstCartItemNote = (): void => {
    this.repository.getFirstCartItemNoteField().clear();
  };

  submitFirstCartItemNote = (): void => {
    this.repository.submitFirstCartItemNote();
  };

  getFirstCartItemNoteField = (): Cypress.Chainable => {
    return this.repository.getFirstCartItemNoteField();
  };

  getCartSummary = (): Cypress.Chainable => {
    return this.repository.getCartSummary();
  };

  getCartDiscountSummary = (): Cypress.Chainable => {
    return this.repository.getCartDiscountSummary();
  };

  getCartItemChangeQuantityField = (sku: string): Cypress.Chainable => {
    return this.repository.getCartItemChangeQuantityField(sku);
  };

  // The B2C cart lines print no sku, so a line is found by the quantity form it posts to, which every shop keys by sku.
  findCartItem = (params: FindCartItemParams): Cypress.Chainable => {
    return this.repository.findCartItemChangeQuantityForm(params.sku);
  };

  addCustomOrderReferenceInput = (reference: string): void => {
    this.repository.getCustomOrderReferenceInput().type(reference);
    this.repository.getCustomOrderReferenceSubmitButton().click();
  };

  getBody = (): Cypress.Chainable => {
    return cy.get('body');
  };

  getCancelOrderAmendmentButton = (): Cypress.Chainable => {
    return this.repository.getCancelOrderAmendmentButton();
  };

  getCartItemSummary = (itemIndex: number): Cypress.Chainable => {
    return this.repository.getCartItemSummaryBlock(itemIndex);
  };

  cancelOrderAmendment = (): void => {
    const cancelOrderAmendmentButton = this.repository.getCancelOrderAmendmentButton();

    if (cancelOrderAmendmentButton) {
      cancelOrderAmendmentButton.click();
    }
  };

  changeConfiguredBundleQuantity = (params: ChangeConfiguredBundleQuantityParams): void => {
    const input = this.repository.getConfiguredBundleQuantityField(params.bundleName);

    input.type('{selectall}', { force: true });
    input.type(String(params.quantity), { force: true });
    this.repository.submitConfiguredBundleQuantity(params.bundleName);
  };

  getConfiguredBundles = (): Cypress.Chainable => {
    return this.repository.getConfiguredBundles();
  };

  getProductCartItems = (): Cypress.Chainable => {
    return this.repository.getProductCartItems();
  };

  getCartItemsListTitles = (): Cypress.Chainable => {
    return this.repository.getCartItemsListTitles();
  };

  assertServicePointsDisplayed = (): void => {
    this.getProductCartItems().contains('Service point');
  };

  getCartItemAvailabilityLabel = (): Cypress.Chainable => {
    return this.repository.getCartItemAvailabilityLabel();
  };
}

interface FindCartItemParams {
  sku: string;
}

interface ConfigureProductParams {
  sku: string;
}

interface QuickAddToCartParams {
  sku: string;
  quantity?: number;
}

interface RemoveProductParams {
  sku: string;
}

interface ChangeQuantityParams {
  sku: string;
  quantity: number;
}

interface CartItemNoteAddParams {
  message: string;
}

interface ChangeConfiguredBundleQuantityParams {
  bundleName: string;
  quantity: number;
}
