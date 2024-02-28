import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../utils/inversify/types';
import { CartRepository } from './cart-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { YvesPage } from '../yves-page';

@injectable()
@autoWired
export class CartPage extends YvesPage {
  protected PAGE_URL: string = '/cart';

  constructor(@inject(TYPES.YvesCartRepository) private repository: CartRepository) {
    super();
  }

  public quickAddToCart = (sku: string, quantity?: number): void => {
    this.repository.getQuickAddToCartSkuField().clear().type(sku);
    this.repository.getQuickAddToCartProductListField().click();

    this.repository
      .getQuickAddToCartQuantityField()
      .clear()
      .type(String(quantity ?? 1));

    this.repository.getQuickAddToCartSubmitButton().click();
    cy.contains('Items added successfully').should('exist');
  };

  public startCheckout = (): void => {
    this.repository.getCheckoutButton().click();
  };

  public removeProduct = (sku: string): void => {
    const form = this.repository.findCartItemRemovalForm(sku);

    if (!form) {
      return;
    }

    form.submit();
  };

  public changeQuantity = (sku: string, newQuantity: number): void => {
    const form = this.repository.findCartItemChangeQuantityForm(sku);
    const input = this.repository.getCartItemChangeQuantityField(sku);

    if (!form || !input) {
      return;
    }

    input.type('{selectall}').type(String(newQuantity));
    form.submit();
  };

  public clearCart = (): void => {
    const form = this.repository.findClearCartForm();

    if (form) {
      form.submit();
    }
  };
}
