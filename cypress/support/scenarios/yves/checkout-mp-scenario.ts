import {
  CartPage,
  CheckoutAddressPage,
  CheckoutCustomerPage,
  CheckoutPaymentPage,
  CheckoutShipmentPage,
  CheckoutSummaryPage,
} from '@pages/yves';
import { CliHelper, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

interface CheckoutMpExecuteParams {
  isGuest: boolean;
  isMultiShipment?: boolean;
}

@injectable()
@autoWired
export class CheckoutMpScenario {
  @inject(CartPage) private cartPage: CartPage;
  @inject(CheckoutAddressPage) private checkoutAddressPage: CheckoutAddressPage;
  @inject(CheckoutCustomerPage) private checkoutCustomerPage: CheckoutCustomerPage;
  @inject(CheckoutShipmentPage) private checkoutShipmentPage: CheckoutShipmentPage;
  @inject(CheckoutPaymentPage) private checkoutPaymentPage: CheckoutPaymentPage;
  @inject(CheckoutSummaryPage) private checkoutSummaryPage: CheckoutSummaryPage;
  @inject(CliHelper) private cliHelper: CliHelper;

  execute = (params: CheckoutMpExecuteParams): void => {
    const { isGuest, isMultiShipment } = params;

    this.cartPage.visit();
    this.cartPage.startCheckout();

    if (isGuest) {
      this.checkoutCustomerPage.checkoutAsGuest();
    }

    this.fillShippingAddress(isMultiShipment);
    this.checkoutShipmentPage.setStandardShippingMethod();
    this.checkoutPaymentPage.setDummyMarketplacePaymentMethod();
    this.checkoutSummaryPage.placeOrder();

    this.cliHelper.run(['console oms:check-condition', 'console oms:check-timeout']);
  };

  private fillShippingAddress = (isMultiShipment: boolean = false): void => {
    if (isMultiShipment) {
      this.checkoutAddressPage.fillMultiShippingAddress();

      return;
    }

    this.checkoutAddressPage.fillShippingAddress();
  };
}
