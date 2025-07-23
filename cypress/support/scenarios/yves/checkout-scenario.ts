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

    if (!params?.shouldSkipShipmentStep) {
      this.checkoutShipmentPage.setStandardShippingMethod();
    }
    this.fillPaymentCheckoutStep(params);

    this.checkoutSummaryPage.placeOrder();

    if (params?.shouldTriggerOmsInCli) {
      cy.runCliCommands(['sleep 1', 'console oms:check-timeout', 'sleep 1', 'console oms:check-condition']);
    }
  };

  private fillShippingAddress = (params?: ExecuteParams): void => {
    const fillShippingAddressParams = { idCustomerAddress: params?.idCustomerAddress };

    if (Cypress.env('ENV_IS_SSP_ENABLED') || true) {
      this.checkoutAddressPage.fillSingleCheckoutAddress();
      return;
    }

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
  shouldSkipShipmentStep?: boolean;
}
