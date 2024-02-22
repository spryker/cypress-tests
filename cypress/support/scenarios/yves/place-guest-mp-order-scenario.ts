import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { CartPage } from '../../pages/yves/cart/cart-page';
import { CheckoutCustomerPage } from '../../pages/yves/checkout/customer/checkout-customer-page';
import { CheckoutAddressPage } from '../../pages/yves/checkout/address/checkout-address-page';
import { CheckoutShipmentPage } from '../../pages/yves/checkout/shipment/checkout-shipment-page';
import { CheckoutPaymentPage } from '../../pages/yves/checkout/payment/checkout-payment-page';
import { CheckoutSummaryPage } from '../../pages/yves/checkout/summary/checkout-summary-page';
import { autoWired } from '../../utils/inversify/auto-wired';
import { CliHelper } from '../../helpers/cli-helper';
import {Guest} from "../../types/refactor_this_file_and_drop_it";

@injectable()
@autoWired
export class PlaceGuestMpOrderScenario {
  constructor(
    @inject(CartPage) private cartPage: CartPage,
    @inject(CheckoutCustomerPage) private checkoutCustomerPage: CheckoutCustomerPage,
    @inject(CheckoutAddressPage) private checkoutAddressPage: CheckoutAddressPage,
    @inject(CheckoutShipmentPage) private checkoutShipmentPage: CheckoutShipmentPage,
    @inject(CheckoutPaymentPage) private checkoutPaymentPage: CheckoutPaymentPage,
    @inject(CheckoutSummaryPage) private checkoutSummaryPage: CheckoutSummaryPage,
    @inject(CliHelper) private cliHelper: CliHelper
  ) {}

  public execute = (productSkus: string[]): Guest => {
    cy.visit(this.cartPage.PAGE_URL);
    productSkus.forEach((productSku: string) => {
      this.cartPage.quickAddToCart(productSku, 1);
    });

    this.cartPage.startCheckout();

    const guest: Guest = this.checkoutCustomerPage.checkoutAsGuest();
    this.checkoutAddressPage.fillShippingAddress();
    this.checkoutShipmentPage.setStandardShippingMethod();
    this.checkoutPaymentPage.setDummyMarketplacePaymentMethod();
    this.checkoutSummaryPage.placeOrder();

    this.cliHelper.run('console oms:check-condition');
    this.cliHelper.run('console oms:check-timeout');

    return guest;
  };
}
