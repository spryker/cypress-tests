import 'reflect-metadata';
import { AbstractPage } from '../../abstract-page';
import { Repository } from './repository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';

@injectable()
export class Page extends AbstractPage {
  PAGE_URL = '/cart';
  repository: Repository;

  constructor(@inject(TYPES.CartRepository) repository: Repository) {
    super();
    this.repository = repository;
  }

  quickAddToCart = (sku: string, quantity?: number): void => {
    this.repository.getQuickAddToCartSkuField().then((elem) => elem.val(sku));
    this.repository
      .getQuickAddToCartQuantityField()
      .clear()
      .type(String(quantity ?? 1));

    this.repository.getQuickAddToCartSubmitButton().click();
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

  startCheckout = (): void => {
    this.repository.getCheckoutButton().click();
  };
}
