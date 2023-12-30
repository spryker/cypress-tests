import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../utils/inversify/auto-provide';
import { YvesCartPage } from '../../pages/yves/cart/yves-cart-page';
import { YvesCheckoutCustomerPage } from '../../pages/yves/checkout/customer/yves-checkout-customer-page';
import { YvesCheckoutAddressPage } from '../../pages/yves/checkout/address/yves-checkout-address-page';
import { YvesCheckoutShipmentPage } from '../../pages/yves/checkout/shipment/yves-checkout-shipment-page';
import { YvesCheckoutPaymentPage } from '../../pages/yves/checkout/payment/yves-checkout-payment-page';
import { YvesCheckoutSummaryPage } from '../../pages/yves/checkout/summary/yves-checkout-summary-page';

@injectable()
@autoProvide
export class PlaceGuestOrderScenario {
  constructor(
    @inject(YvesCartPage) private cartPage: YvesCartPage,
    @inject(YvesCheckoutCustomerPage)
    private checkoutCustomerPage: YvesCheckoutCustomerPage,
    @inject(YvesCheckoutAddressPage)
    private checkoutAddressPage: YvesCheckoutAddressPage,
    @inject(YvesCheckoutShipmentPage)
    private checkoutShipmentPage: YvesCheckoutShipmentPage,
    @inject(YvesCheckoutPaymentPage)
    private checkoutPaymentPage: YvesCheckoutPaymentPage,
    @inject(YvesCheckoutSummaryPage)
    private checkoutSummaryPage: YvesCheckoutSummaryPage
  ) {}

  execute = (productSkus: string[]): void => {
    cy.visit(this.cartPage.PAGE_URL);
    productSkus.forEach((productSku: string) => {
      this.cartPage.quickAddToCart(productSku, 1);
    });

    this.cartPage.startCheckout();

    this.checkoutCustomerPage.checkoutAsGuest();
    this.checkoutAddressPage.fillShippingAddress();
    this.checkoutShipmentPage.setStandardShippingMethod();
    this.checkoutPaymentPage.setDummyPaymentMethod();
    this.checkoutSummaryPage.placeOrder();
  };
}
