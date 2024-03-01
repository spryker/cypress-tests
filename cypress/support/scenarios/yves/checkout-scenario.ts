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
export class CheckoutScenario {
  constructor(
    @inject(CartPage) private cartPage: CartPage,
    @inject(CheckoutAddressPage) private checkoutAddressPage: CheckoutAddressPage,
    @inject(CheckoutCustomerPage) private checkoutCustomerPage: CheckoutCustomerPage,
    @inject(CheckoutShipmentPage) private checkoutShipmentPage: CheckoutShipmentPage,
    @inject(CheckoutPaymentPage) private checkoutPaymentPage: CheckoutPaymentPage,
    @inject(CheckoutSummaryPage) private checkoutSummaryPage: CheckoutSummaryPage,
    @inject(CliHelper) private cliHelper: CliHelper
  ) {}

  public execute = (isGuest: boolean = false, isMultiShipment: boolean = false): void => {
    this.cartPage.visit();
    this.cartPage.startCheckout();

    if (isGuest) {
      this.checkoutCustomerPage.checkoutAsGuest();
    }

    this.fillShippingAddress(isMultiShipment);
    this.checkoutShipmentPage.setStandardShippingMethod();
    this.checkoutPaymentPage.setDummyPaymentMethod();
    this.checkoutSummaryPage.placeOrder();

    cy.wait(1000);
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
