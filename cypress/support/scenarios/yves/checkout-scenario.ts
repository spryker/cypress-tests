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
export class CheckoutScenario {
  @inject(CartPage) private cartPage: CartPage;
  @inject(CheckoutAddressPage) private checkoutAddressPage: CheckoutAddressPage;
  @inject(CheckoutCustomerPage) private checkoutCustomerPage: CheckoutCustomerPage;
  @inject(CheckoutShipmentPage) private checkoutShipmentPage: CheckoutShipmentPage;
  @inject(CheckoutPaymentPage) private checkoutPaymentPage: CheckoutPaymentPage;
  @inject(CheckoutSummaryPage) private checkoutSummaryPage: CheckoutSummaryPage;

  execute = (params?: ExecuteParams): void => {
    this.cartPage.visit();
    this.cartPage.startCheckout();

    if (params?.isGuest) {
      this.checkoutCustomerPage.checkoutAsGuest();
    }

    this.fillShippingAddress(params);
    this.checkoutShipmentPage.setStandardShippingMethod();
    this.fillPaymentCheckoutStep(params);

    this.checkoutSummaryPage.placeOrder();

    if (params?.shouldTriggerOmsInCli) {
      cy.runCliCommands([
        'console oms:check-condition',
        'console oms:check-timeout',
        'console oms:check-condition',
        'console oms:check-timeout',
      ]);
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

  private fillPaymentCheckoutStep = (params?: ExecuteParams): void => {
    const paymentMethods = {
      dummyPaymentInvoice: () => this.checkoutPaymentPage.setDummyPaymentMethod(),
      dummyPaymentCreditCard: () => this.checkoutPaymentPage.setDummyPaymentCreditCardMethod(),
      dummyMarketplacePaymentInvoice: () => this.checkoutPaymentPage.setDummyMarketplacePaymentMethod(),
    };

    const paymentMethod = params?.paymentMethod || 'dummyPaymentInvoice';
    const paymentFunction = paymentMethods[paymentMethod as keyof typeof paymentMethods];

    paymentFunction();
  };
}

interface ExecuteParams {
  isGuest?: boolean;
  isMultiShipment?: boolean;
  idCustomerAddress?: number;
  shouldTriggerOmsInCli?: boolean;
  paymentMethod?: string;
}
