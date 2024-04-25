import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CartRepository } from './cart-repository';

@injectable()
@autoWired
export class CartPage extends YvesPage {
  @inject(REPOSITORIES.CartRepository) private repository: CartRepository;

  protected PAGE_URL = '/cart';
  protected GET_ITEMS_URL = '/en/cart/get-cart-items';
  protected QUICK_ADD_AJAX_REQUEST_ALIAS = 'quickAddAjaxRequest';
  protected GET_ITEMS_AJAX_REQUEST_ALIAS = 'getItemsAjaxRequest';

  visitCartWithItems = (): void => {
    cy.intercept('GET', this.GET_ITEMS_URL).as(this.GET_ITEMS_AJAX_REQUEST_ALIAS);
    this.visit();
    cy.wait(`@${this.GET_ITEMS_AJAX_REQUEST_ALIAS}`);
  };

  quickAddToCart = (params: QuickAddToCartParams): void => {
    this.repository.getQuickAddToCartAction().then((action) => {
      cy.intercept('POST', action).as(this.QUICK_ADD_AJAX_REQUEST_ALIAS);
    });

    this.repository.getQuickAddToCartSkuField().clear().type(params.sku);
    this.repository.getQuickAddToCartProductListField().click();

    this.repository
      .getQuickAddToCartQuantityField()
      .clear()
      .type(String(params?.quantity || 1));

    this.repository.getQuickAddToCartSubmitButton().click();

    cy.wait(`@${this.QUICK_ADD_AJAX_REQUEST_ALIAS}`);
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
