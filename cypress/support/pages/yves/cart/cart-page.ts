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

    this.repository.getPageLayoutCartAjaxLoader().should('be.not.visible');
  };

  startCheckout = (): void => {
    this.repository.getCheckoutButton().click();
  };

  removeProduct = (params: RemoveProductParams): void => {
    const form = this.repository.findCartItemRemovalForm(params.sku);

    if (!form) {
      return;
    }

    form.submit();
  };

  changeQuantity = (params: ChangeQuantityParams): void => {
    const form = this.repository.findCartItemChangeQuantityForm(params.sku);
    const input = this.repository.getCartItemChangeQuantityField(params.sku);

    if (!form || !input) {
      return;
    }

    input.type('{selectall}').type(String(params.quantity));
    form.submit();
  };

  clearCart = (): void => {
    const form = this.repository.findClearCartForm();

    if (form) {
      form.submit();
    }
  };

  addLastCartItemNote = (params: CartItemNoteAddParams): void => {
    this.repository.getLastCartItemNoteField().type(params.message);
  };

  clearLastCartItemNote = (): void => {
    this.repository.getLastCartItemNoteField().clear();
  };

  submitLastCartItemNote = (): void => {
    this.repository.getLastCartItemNoteSubmitButton().click();
    this.repository.getPageLayoutCartAjaxLoader().should('be.not.visible');
  };

  getLastCartItemNoteField = (): Cypress.Chainable => {
    return this.repository.getLastCartItemNoteField();
  };

  getCheckoutButton(): Cypress.Chainable {
    return this.repository.getCheckoutButton();
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
