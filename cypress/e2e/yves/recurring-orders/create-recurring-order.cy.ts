import { container } from '@utils';
import { CreateRecurringOrderStaticFixtures, CreateRecurringOrderDynamicFixtures } from '@interfaces/yves';
import {
  CartPage,
  CheckoutAddressPage,
  CheckoutPaymentPage,
  CheckoutShipmentPage,
  CheckoutSummaryPage,
  CheckoutSummaryRecurringOrderPage,
  RecurringOrderListPage,
} from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'recurring order creation at checkout',
  { tags: ['@yves', '@recurring-orders', 'recurring-orders', 'spryker-core'] },
  (): void => {
    if (['b2c', 'b2c-mp', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite', () => {});
      return;
    }

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const cartPage = container.get(CartPage);
    const checkoutAddressPage = container.get(CheckoutAddressPage);
    const checkoutShipmentPage = container.get(CheckoutShipmentPage);
    const checkoutPaymentPage = container.get(CheckoutPaymentPage);
    const checkoutSummaryPage = container.get(CheckoutSummaryPage);
    const checkoutSummaryRecurringOrderPage = container.get(CheckoutSummaryRecurringOrderPage);
    const recurringOrderListPage = container.get(RecurringOrderListPage);

    let staticFixtures: CreateRecurringOrderStaticFixtures;
    let dynamicFixtures: CreateRecurringOrderDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    const proceedToSummaryWithInvoicePayment = (email: string): void => {
      customerLoginScenario.execute({ email, password: staticFixtures.defaultPassword, withoutSession: true });
      cartPage.visit();
      cartPage.startCheckout();
      checkoutAddressPage.fillShippingAddress();
      checkoutShipmentPage.setStandardShippingMethod();
      checkoutPaymentPage.setDummyPaymentMethod();
    };

    it('company user can create a recurring order at checkout and see it in the recurring orders list', (): void => {
      proceedToSummaryWithInvoicePayment(dynamicFixtures.buyer.email);

      checkoutSummaryRecurringOrderPage.assertRecurringOrderToggleVisible();
      checkoutSummaryRecurringOrderPage.enableRecurringOrder();
      checkoutSummaryRecurringOrderPage.selectCadenceType('monthly');
      checkoutSummaryRecurringOrderPage.confirmRecurringOrder();
      checkoutSummaryPage.placeOrder();

      cy.url().should('include', '/checkout/success');

      recurringOrderListPage.visit();
      recurringOrderListPage.assertScheduleVisible(dynamicFixtures.buyer.email);
    });

    it('recurring order widget is not visible when credit card payment method is selected', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
      cartPage.visit();
      cartPage.startCheckout();
      checkoutAddressPage.fillShippingAddress();
      checkoutShipmentPage.setStandardShippingMethod();
      checkoutPaymentPage.setDummyPaymentCreditCardMethod();

      checkoutSummaryRecurringOrderPage.assertRecurringOrderToggleNotVisible();
    });
  }
);
