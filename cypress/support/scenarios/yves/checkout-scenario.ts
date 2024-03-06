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

interface CheckoutExecuteParams {
  isGuest: boolean;
  isMultiShipment?: boolean;
  idCustomerAddress?: number;
}

@injectable()
@autoWired
export class CheckoutScenario {
  @inject(CartPage) private cartPage: CartPage;
  @inject(CheckoutAddressPage) private checkoutAddressPage: CheckoutAddressPage;
  @inject(CheckoutCustomerPage) private checkoutCustomerPage: CheckoutCustomerPage;
  @inject(CheckoutShipmentPage) private checkoutShipmentPage: CheckoutShipmentPage;
  @inject(CheckoutPaymentPage) private checkoutPaymentPage: CheckoutPaymentPage;
  @inject(CheckoutSummaryPage) private checkoutSummaryPage: CheckoutSummaryPage;
  @inject(CliHelper) private cliHelper: CliHelper;

  execute = (params: CheckoutExecuteParams): void => {
    const { isGuest, isMultiShipment, idCustomerAddress } = params;

    this.cartPage.visit();
    this.cartPage.startCheckout();

    if (isGuest) {
      this.checkoutCustomerPage.checkoutAsGuest();
    }

    this.fillShippingAddress(isMultiShipment, idCustomerAddress);
    this.checkoutShipmentPage.setStandardShippingMethod();
    this.checkoutPaymentPage.setDummyPaymentMethod();
    this.checkoutSummaryPage.placeOrder();

    this.cliHelper.run(['console oms:check-condition', 'console oms:check-timeout']);
  };

  private fillShippingAddress = (isMultiShipment: boolean = false, idCustomerAddress?: number): void => {
    if (isMultiShipment) {
      this.checkoutAddressPage.fillMultiShippingAddress(idCustomerAddress);

      return;
    }

    this.checkoutAddressPage.fillShippingAddress(idCustomerAddress);
  };
}
