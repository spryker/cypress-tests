import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../utils/inversify/auto-wired';
import { CliHelper } from '../../helpers/cli-helper';
import {
  CartPage,
  CheckoutAddressPage,
  CheckoutPaymentPage,
  CheckoutShipmentPage,
  CheckoutSummaryPage,
} from '../../pages/yves';

@injectable()
@autoWired
export class CheckoutScenario {
  constructor(
    @inject(CartPage) private cartPage: CartPage,
    @inject(CheckoutAddressPage) private checkoutAddressPage: CheckoutAddressPage,
    @inject(CheckoutShipmentPage) private checkoutShipmentPage: CheckoutShipmentPage,
    @inject(CheckoutPaymentPage) private checkoutPaymentPage: CheckoutPaymentPage,
    @inject(CheckoutSummaryPage) private checkoutSummaryPage: CheckoutSummaryPage,
    @inject(CliHelper) private cliHelper: CliHelper
  ) {}

  public execute = (): void => {
    this.cartPage.visit();

    this.cartPage.startCheckout();
    this.checkoutAddressPage.fillShippingAddress();
    this.checkoutShipmentPage.setStandardShippingMethod();
    this.checkoutPaymentPage.setDummyPaymentMethod();
    this.checkoutSummaryPage.placeOrder();

    this.cliHelper.run(['console oms:check-condition', 'console oms:check-timeout']);
  };
}
