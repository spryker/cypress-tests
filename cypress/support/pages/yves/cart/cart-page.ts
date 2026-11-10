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

  // Added asynchronously like a redeemed code, so this waits for the add and the cart re-render.
  addPromotionalProduct = (sku: string): void => {
    cy.intercept({ method: 'POST', pathname: `**/cart/async/add/${sku}` }).as('promotionalProductAdd');
    cy.intercept({ method: 'GET', pathname: '**/cart/async/view' }).as('cartAsyncView');

    this.repository.getPromotionalProductAddToCartButton(sku).click();

    cy.wait('@promotionalProductAdd');
    cy.wait('@cartAsyncView');
  };

  getExternalCartShareLink = (): Cypress.Chainable<string> => {
    this.repository.getExternalCartShareToggle().click({ force: true });

    return this.repository.getExternalCartShareLinkInput().invoke('val');
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

  configureProduct = (params: ConfigureProductParams): void => {
    this.getCartItems({ sku: params.sku }).first().find(this.repository.getConfigureButtonSelector()).click();
  };

  // The B2C cart lines print no sku, so a line is also recognised by the quantity or removal form it posts to,
  // which every shop keys by sku; a promotional line has no quantity form.
  getCartItems = (params: GetCartItemsParams): Cypress.Chainable => {
    return this.repository
      .getProductCartItems()
      .filter(
        `:contains("${params.sku}"), :has([action$="change-quantity/${params.sku}"]), :has([action*="/remove/${params.sku}/"])`
      );
  };

  getCartItemsChargingUnitPrice = (params: GetCartItemsChargingUnitPriceParams): Cypress.Chainable => {
    return this.getCartItems({ sku: params.sku }).filter((_index: number, cartItem: HTMLElement): boolean =>
      this.isChargingUnitPrice(cartItem, params.unitPrice, params.quantity)
    );
  };

  // A product can sit on several cart lines, so each line is checked against the quantity in its own field.
  getCartItemsNotChargingUnitPrice = (params: GetCartItemsNotChargingUnitPriceParams): Cypress.Chainable => {
    return this.getCartItems({ sku: params.sku }).filter(
      (_index: number, cartItem: HTMLElement): boolean =>
        !this.isChargingUnitPrice(cartItem, params.unitPrice, this.getCartItemQuantity(cartItem))
    );
  };

  getCartItemQuantities = (params: GetCartItemsParams): Cypress.Chainable<number[]> => {
    return this.getCartItems({ sku: params.sku }).then(($cartItems: JQuery<HTMLElement>): number[] =>
      $cartItems.toArray().map((cartItem: HTMLElement): number => this.getCartItemQuantity(cartItem))
    );
  };

  // cy.get() on the clear form fails outright on an empty cart, so a spec that only needs a known
  // starting point has to look before it clears. The B2C shops have no clear-cart form, so their lines
  // are removed one by one through the removal form each line carries.
  clearCartIfNotEmpty = (): void => {
    this.getBody().then(($body) => {
      if ($body.find(this.repository.getClearCartFormSelector()).length) {
        this.clearCart();

        return;
      }

      // The header's mini cart repeats each line with its removal form, so each line is posted once.
      const removalRequests = new Map<string, string>();

      $body.find(this.repository.getCartItemRemovalFormSelector()).each((index: number, form: HTMLElement): void => {
        removalRequests.set((form as HTMLFormElement).action, Cypress.$(form).serialize());
      });

      if (!removalRequests.size) {
        return;
      }

      removalRequests.forEach((body: string, url: string): void => {
        cy.request({ method: 'POST', url, form: true, body });
      });

      this.visit();
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
    this.repository.changeConfiguredBundleQuantity(params.bundleName, params.quantity);
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

  private getCartItemQuantity = (cartItem: HTMLElement): number => {
    return Number(Cypress.$(cartItem).find(this.repository.getCartItemQuantityInputSelector()).first().val());
  };

  // The redesigned B2B cart line prints only its total, the other themes the unit price, so a line charging
  // a unit price is recognised by either.
  private isChargingUnitPrice = (cartItem: HTMLElement, unitPrice: string, quantity: number): boolean => {
    const lineTotal = unitPrice.replace(/[\d.,]+/, (amount: string): string =>
      (parseFloat(amount.replace(/,/g, '')) * quantity).toFixed(2)
    );

    return cartItem.innerText.includes(unitPrice) || cartItem.innerText.includes(lineTotal);
  };
}

interface GetCartItemsParams {
  sku: string;
}

interface GetCartItemsChargingUnitPriceParams {
  sku: string;
  unitPrice: string;
  quantity: number;
}

interface GetCartItemsNotChargingUnitPriceParams {
  sku: string;
  unitPrice: string;
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
