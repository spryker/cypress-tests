import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../utils/inversify/auto-wired';
import { CliHelper } from '../../helpers/cli-helper';
import {
  CartPage,
  CheckoutAddressPage,
  CheckoutCustomerPage,
  CheckoutPaymentPage,
  CheckoutShipmentPage,
  CheckoutSummaryPage,
} from '../../pages/yves';

@injectable()
@autoWired
export class PlaceMpOrderScenario {
  constructor(
    @inject(CartPage) private cartPage: CartPage,
    @inject(CheckoutCustomerPage) private checkoutCustomerPage: CheckoutCustomerPage,
    @inject(CheckoutAddressPage) private checkoutAddressPage: CheckoutAddressPage,
    @inject(CheckoutShipmentPage) private checkoutShipmentPage: CheckoutShipmentPage,
    @inject(CheckoutPaymentPage) private checkoutPaymentPage: CheckoutPaymentPage,
    @inject(CheckoutSummaryPage) private checkoutSummaryPage: CheckoutSummaryPage,
    @inject(CliHelper) private cliHelper: CliHelper
  ) {}

  public execute = (productSku: string): void => {
    this.cartPage.visit();
    this.cartPage.quickAddToCart(productSku);

    this.cartPage.startCheckout();

    this.checkoutAddressPage.fillShippingAddress();
    this.checkoutShipmentPage.setStandardShippingMethod();
    this.checkoutPaymentPage.setDummyMarketplacePaymentMethod();
    this.checkoutSummaryPage.placeOrder();

    this.cliHelper.run(['console oms:check-condition', 'console oms:check-timeout']);
  };
}
