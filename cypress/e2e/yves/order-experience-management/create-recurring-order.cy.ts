import { container } from '@utils';
import { CreateRecurringOrderStaticFixtures, CreateRecurringOrderDynamicFixtures } from '@interfaces/yves';
import { CheckoutSummaryPage, CheckoutSummaryRecurringOrderPage, RecurringOrderListPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function addDaysFromToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return formatDate(date);
}

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

      checkoutSummaryRecurringOrderPage.getRecurringOrderToggle().should('be.visible');
      checkoutSummaryRecurringOrderPage.enableRecurringOrder();
      checkoutSummaryRecurringOrderPage.getCadenceTypeSelect().should('be.visible');
      checkoutSummaryRecurringOrderPage.fillScheduleName(staticFixtures.scheduleName);
      checkoutSummaryRecurringOrderPage.selectCadenceType('monthly');
      checkoutSummaryRecurringOrderPage.selectStartDate(formatDate(new Date()));
      checkoutSummaryRecurringOrderPage.confirmRecurringOrder();
      checkoutSummaryRecurringOrderPage.getConfirmButton().should('not.exist');
      checkoutSummaryPage.placeOrder();

      cy.url().should('include', '/checkout/success');

      recurringOrderListPage.visit();
      recurringOrderListPage.getListTable().contains(staticFixtures.scheduleName).should('be.visible');
    });

    it('buyer can pick a start date, with today as the earliest selectable value and past dates rejected', (): void => {
      const futureDate = addDaysFromToday(30);

      customerLoginScenario.execute({
        email: dynamicFixtures.buyerForStartDate.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
      checkoutScenario.execute({ shouldSkipPlaceOrder: true });

      checkoutSummaryRecurringOrderPage.getRecurringOrderToggle().should('be.visible');
      checkoutSummaryRecurringOrderPage.enableRecurringOrder();
      checkoutSummaryRecurringOrderPage.getCadenceTypeSelect().should('be.visible');

      checkoutSummaryRecurringOrderPage.getStartDateInput().should('have.value', '').and('have.attr', 'required');
      checkoutSummaryRecurringOrderPage
        .getStartDateTooltip()
        .should('exist')
        .and('contain.text', staticFixtures.startDateTooltipText);
      checkoutSummaryRecurringOrderPage.getStartDateInput().should('have.attr', 'min', formatDate(new Date()));

      checkoutSummaryRecurringOrderPage.selectStartDate(addDaysFromToday(-30));
      checkoutSummaryRecurringOrderPage.getStartDateInput().should(($input): void => {
        expect(($input[0] as HTMLInputElement).validity.rangeUnderflow).to.eq(true);
      });

      checkoutSummaryRecurringOrderPage.selectStartDate(futureDate);
      checkoutSummaryRecurringOrderPage.getStartDateInput().should('have.value', futureDate);
    });

    it('recurring order widget is not visible when credit card payment method is selected', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyerForCreditCard.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
      checkoutScenario.execute({ paymentMethod: 'dummyPaymentCreditCard', shouldSkipPlaceOrder: true });

      checkoutSummaryRecurringOrderPage.getRecurringOrderToggle().should('not.exist');
    });
  }
);
