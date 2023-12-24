import { Page as CartPage } from '../pages/yves/cart/page';
import { Page as CheckoutAddressPage } from '../pages/yves/checkout/address/page';
import { Page as CheckoutShipmentPage } from '../pages/yves/checkout/shipment/page';
import { Page as CheckoutPaymentPage } from '../pages/yves/checkout/payment/page';
import { Page as CheckoutSummaryPage } from '../pages/yves/checkout/summary/page';
import { inject, injectable } from 'inversify';
import { autoProvide } from '../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class PlaceCustomerOrderScenario {
  constructor(
    @inject(CartPage) private cartPage: CartPage,
    @inject(CheckoutAddressPage)
    private checkoutAddressPage: CheckoutAddressPage,
    @inject(CheckoutShipmentPage)
    private checkoutShipmentPage: CheckoutShipmentPage,
    @inject(CheckoutPaymentPage)
    private checkoutPaymentPage: CheckoutPaymentPage,
    @inject(CheckoutSummaryPage)
    private checkoutSummaryPage: CheckoutSummaryPage
  ) {}

  execute = (productSkus: string[]): void => {
    cy.visit(this.cartPage.PAGE_URL);
    productSkus.forEach((productSku: string) => {
      this.cartPage.quickAddToCart(productSku, 1);
    });

    this.cartPage.startCheckout();

    this.checkoutAddressPage.fillShippingAddress();
    this.checkoutShipmentPage.setStandardShippingMethod();
    this.checkoutPaymentPage.setDummyPaymentMethod();
    this.checkoutSummaryPage.placeOrder();
  };
}
