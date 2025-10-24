import {
  CartPage,
  CheckoutAddressPage,
  CheckoutCustomerPage,
  CheckoutPaymentPage,
  CheckoutShipmentPage,
  CheckoutSummaryPage,
} from '@pages/yves';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class CheckoutMpScenario {
  @inject(CartPage) private cartPage: CartPage;
  @inject(CheckoutAddressPage) private checkoutAddressPage: CheckoutAddressPage;
  @inject(CheckoutCustomerPage) private checkoutCustomerPage: CheckoutCustomerPage;
  @inject(CheckoutShipmentPage) private checkoutShipmentPage: CheckoutShipmentPage;
  @inject(CheckoutPaymentPage) private checkoutPaymentPage: CheckoutPaymentPage;
  @inject(CheckoutSummaryPage) private checkoutSummaryPage: CheckoutSummaryPage;

  execute = (params?: ExecuteParams): string => {
    this.cartPage.visit();
    this.cartPage.startCheckout();

    const customerEmail = this.checkoutGuest(params);

    this.processCheckout(params);
    this.runOmsCommands(params);

    return customerEmail;
  };

  private checkoutGuest = (params?: ExecuteParams): string => {
    return params?.isGuest ? this.checkoutCustomerPage.checkoutAsGuest() : '';
  };

  private processCheckout = (params?: ExecuteParams): void => {
    this.fillShippingAddress(params);
    this.checkoutShipmentPage.setStandardShippingMethod();
    this.checkoutPaymentPage.setDummyMarketplacePaymentMethod();
    this.checkoutSummaryPage.placeOrder();
  };

  private runOmsCommands = (params?: ExecuteParams): void => {
    if (params?.shouldTriggerOmsInCli) {
      cy.runCliCommands(['vendor/bin/console oms:check-condition', 'vendor/bin/console oms:check-timeout']);
    }
  };

  private fillShippingAddress = (params?: ExecuteParams): void => {
    const fillShippingAddressParams = { idCustomerAddress: params?.idCustomerAddress };

    if (params?.isMultiShipment) {
      this.checkoutAddressPage.fillMultiShippingAddress(fillShippingAddressParams);

      return;
    }

    this.checkoutAddressPage.fillShippingAddress(fillShippingAddressParams);
  };
}

interface ExecuteParams {
  isGuest?: boolean;
  isMultiShipment?: boolean;
  idCustomerAddress?: number;
  shouldTriggerOmsInCli?: boolean;
}
