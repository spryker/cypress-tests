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
