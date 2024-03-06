import { TYPES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { YvesPage } from '../yves-page';
import { CartRepository } from './cart-repository';

@injectable()
@autoWired
export class CartPage extends YvesPage {
  @inject(TYPES.CartRepository) private repository: CartRepository;

  protected PAGE_URL: string = '/cart';

  quickAddToCart = (sku: string, quantity?: number): void => {
    this.repository.getQuickAddToCartSkuField().clear().type(sku);
    this.repository.getQuickAddToCartProductListField().click();

    this.repository
      .getQuickAddToCartQuantityField()
      .clear()
      .type(String(quantity ?? 1));

    this.repository.getQuickAddToCartSubmitButton().click();
    cy.contains('Items added successfully').should('exist');
  };

  startCheckout = (): void => {
    this.repository.getCheckoutButton().click();
  };

  removeProduct = (sku: string): void => {
    const form = this.repository.findCartItemRemovalForm(sku);

    if (!form) {
      return;
    }

    form.submit();
  };

  changeQuantity = (sku: string, newQuantity: number): void => {
    const form = this.repository.findCartItemChangeQuantityForm(sku);
    const input = this.repository.getCartItemChangeQuantityField(sku);

    if (!form || !input) {
      return;
    }

    input.type('{selectall}').type(String(newQuantity));
    form.submit();
  };

  clearCart = (): void => {
    const form = this.repository.findClearCartForm();

    if (form) {
      form.submit();
    }
  };
}
