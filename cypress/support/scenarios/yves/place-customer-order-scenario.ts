import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { YvesCartPage } from '../../pages/yves/cart/yves-cart-page';
import { YvesCheckoutAddressPage } from '../../pages/yves/checkout/address/yves-checkout-address-page';
import { YvesCheckoutShipmentPage } from '../../pages/yves/checkout/shipment/yves-checkout-shipment-page';
import { YvesCheckoutPaymentPage } from '../../pages/yves/checkout/payment/yves-checkout-payment-page';
import { YvesCheckoutSummaryPage } from '../../pages/yves/checkout/summary/yves-checkout-summary-page';
import { autoWired } from '../../utils/inversify/auto-wired';
import { CliHelper } from '../../helpers/cli-helper';

@injectable()
@autoWired
export class PlaceCustomerOrderScenario {
  constructor(
    @inject(YvesCartPage) private cartPage: YvesCartPage,
    @inject(YvesCheckoutAddressPage) private checkoutAddressPage: YvesCheckoutAddressPage,
    @inject(YvesCheckoutShipmentPage) private checkoutShipmentPage: YvesCheckoutShipmentPage,
    @inject(YvesCheckoutPaymentPage) private checkoutPaymentPage: YvesCheckoutPaymentPage,
    @inject(YvesCheckoutSummaryPage) private checkoutSummaryPage: YvesCheckoutSummaryPage,
    @inject(CliHelper) private cliHelper: CliHelper
  ) {}

  public execute = (productSkus: string[]): void => {
    cy.visit(this.cartPage.PAGE_URL);
    productSkus.forEach((productSku: string) => {
      this.cartPage.quickAddToCart(productSku, 1);
    });

    this.cartPage.startCheckout();

    this.checkoutAddressPage.fillShippingAddress();
    this.checkoutShipmentPage.setStandardShippingMethod();
    this.checkoutPaymentPage.setDummyPaymentMethod();
    this.checkoutSummaryPage.placeOrder();

    this.cliHelper.run('console oms:check-condition');
    this.cliHelper.run('console oms:check-timeout');
  };
}
