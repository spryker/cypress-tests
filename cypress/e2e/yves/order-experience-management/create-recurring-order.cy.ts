import { container } from '@utils';
import { CreateRecurringOrderStaticFixtures, CreateRecurringOrderDynamicFixtures } from '@interfaces/yves';
import { CheckoutSummaryPage, CheckoutSummaryRecurringOrderPage, RecurringOrderListPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe(
  'recurring order creation at checkout',
  { tags: ['@yves', '@order-experience-management', 'order-experience-management', 'spryker-core'] },
  (): void => {
    if (['b2c', 'b2c-mp', 'b2b'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite', () => {});
      return;
    }

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);
    const checkoutSummaryPage = container.get(CheckoutSummaryPage);
    const checkoutSummaryRecurringOrderPage = container.get(CheckoutSummaryRecurringOrderPage);
    const recurringOrderListPage = container.get(RecurringOrderListPage);

    let staticFixtures: CreateRecurringOrderStaticFixtures;
    let dynamicFixtures: CreateRecurringOrderDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('company user can create a recurring order at checkout and see it in the recurring orders list', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
      checkoutScenario.execute({ shouldSkipPlaceOrder: true });

      checkoutSummaryRecurringOrderPage.assertRecurringOrderToggleVisible();
      checkoutSummaryRecurringOrderPage.enableRecurringOrder();
      checkoutSummaryRecurringOrderPage.fillScheduleName(staticFixtures.scheduleName);
      checkoutSummaryRecurringOrderPage.selectCadenceType('monthly');
      checkoutSummaryRecurringOrderPage.confirmRecurringOrder();
      checkoutSummaryPage.placeOrder();

      checkoutSummaryPage.assertCheckoutSuccess();

      recurringOrderListPage.visit();
      recurringOrderListPage.assertScheduleVisible(staticFixtures.scheduleName);
    });

    it('recurring order widget is not visible when credit card payment method is selected', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyerForCreditCard.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
      checkoutScenario.execute({ paymentMethod: 'dummyPaymentCreditCard', shouldSkipPlaceOrder: true });

      checkoutSummaryRecurringOrderPage.assertRecurringOrderToggleNotVisible();
    });
  }
);
