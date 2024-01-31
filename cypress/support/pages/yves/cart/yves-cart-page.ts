import 'reflect-metadata';
import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../utils/inversify/types';
import { YvesCartRepository } from './yves-cart-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class YvesCartPage extends AbstractPage {
  public PAGE_URL: string = '/cart';

  constructor(@inject(TYPES.YvesCartRepository) private repository: YvesCartRepository) {
    super();
  }

  public quickAddToCart = (sku: string, quantity?: number): void => {
    this.repository.getQuickAddToCartSkuField().then((elem) => elem.val(sku));
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
