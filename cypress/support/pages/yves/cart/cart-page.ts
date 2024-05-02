import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CartRepository } from './cart-repository';

@injectable()
@autoWired
export class CartPage extends YvesPage {
  @inject(REPOSITORIES.CartRepository) private repository: CartRepository;

  protected PAGE_URL = '/cart';

  visitCartWithItems = (): void => {
    this.visit();
    this.repository.getCartUpsellingAjaxLoader().should('be.visible');
    this.repository.getCartUpsellingAjaxLoader().should('be.not.visible');
  };

  quickAddToCart = (params: QuickAddToCartParams): void => {
    this.repository.getQuickAddToCartSkuField().clear().type(params.sku);
    this.repository.getQuickAddToCartProductListField().click();

    this.repository
      .getQuickAddToCartQuantityField()
      .clear()
      .type(String(params?.quantity || 1));

    this.repository.getQuickAddToCartSubmitButton().click();

    this.repository.getPageLayoutCartAjaxLoader().should('be.visible');
    this.repository.getPageLayoutCartAjaxLoader().should('be.not.visible');
  };

  startCheckout = (): void => {
    this.repository.getCheckoutButton().click();
  };

  removeProduct = (params: RemoveProductParams): void => {
    const cartItemRemovalButton = this.repository.findCartItemRemovalSubmit(params.sku);

    if (!cartItemRemovalButton) {
      return;
    }

    cartItemRemovalButton.click();

    this.repository.getPageLayoutCartAjaxLoader().should('be.not.visible');
  };

  changeQuantity = (params: ChangeQuantityParams): void => {
    const input = this.repository.getCartItemChangeQuantityField(params.sku);

    if (!input) {
      return;
    }

    input.type('{selectall}').type(String(params.quantity));

    this.repository.getCartItemChangeQuantitySubmit(params.sku).click();

    this.repository.getPageLayoutCartAjaxLoader().should('be.not.visible');
  };

  clearCart = (): void => {
    const form = this.repository.findClearCartForm();

    if (form) {
      form.submit();
    }
  };

  addFirstCartItemNote = (params: CartItemNoteAddParams): void => {
    this.repository.getFirstCartItemNoteField().type(params.message);
  };

  clearFirstCartItemNote = (): void => {
    this.repository.getFirstCartItemNoteField().clear();
  };

  submitFirstCartItemNote = (): void => {
    this.repository.getFirstCartItemNoteSubmitButton().click();

    this.repository.getPageLayoutCartAjaxLoader().should('be.not.visible');
  };

  getFirstCartItemNoteField = (): Cypress.Chainable => {
    return this.repository.getFirstCartItemNoteField();
  };

  getCartSummary(): Cypress.Chainable {
    return this.repository.getCartSummary();
  }

  getCartCounter(): Cypress.Chainable {
    return this.repository.getCartCounter();
  }

  getCartItemChangeQuantityField(sku: string): Cypress.Chainable {
    return this.repository.getCartItemChangeQuantityField(sku);
  }
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
