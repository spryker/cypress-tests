import { container } from '@utils';
import { ManageRecurringOrderStaticFixtures, ManageRecurringOrderDynamicFixtures } from '@interfaces/yves';
import { RecurringOrderListPage, RecurringOrderDetailPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'recurring order management',
  { tags: ['@yves', '@order-experience-management', 'order-experience-management', 'spryker-core'] },
  (): void => {
    if (['b2c', 'b2c-mp', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite', () => {});
      return;
    }

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const recurringOrderListPage = container.get(RecurringOrderListPage);
    const recurringOrderDetailPage = container.get(RecurringOrderDetailPage);

    let staticFixtures: ManageRecurringOrderStaticFixtures;
    let dynamicFixtures: ManageRecurringOrderDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
    });

    it('recurring orders list shows schedules of all statuses', (): void => {
      recurringOrderListPage.visit();

      recurringOrderListPage.assertListTableVisible();
      recurringOrderListPage.assertScheduleRowContains(staticFixtures.scheduleName, 'active');
      recurringOrderListPage.assertScheduleRowContains(staticFixtures.pausedScheduleName, 'paused');
      recurringOrderListPage.assertScheduleRowContains(staticFixtures.cancelledScheduleName, 'cancelled');
    });

    it('detail page shows the schedule name, cadence, and status', (): void => {
      recurringOrderListPage.openSchedule(staticFixtures.scheduleName);

      recurringOrderDetailPage.assertScheduleName(staticFixtures.scheduleName);
      recurringOrderDetailPage.assertCadenceVisible();
      recurringOrderDetailPage.assertStatusBadge('active');
    });

    it('company user can pause an active recurring schedule', (): void => {
      recurringOrderListPage.openSchedule(staticFixtures.scheduleName);

      recurringOrderDetailPage.clickPause();
      recurringOrderDetailPage.confirmPause();

      recurringOrderDetailPage.assertStatusBadge('paused');
    });

    it('company user can resume a paused recurring schedule', (): void => {
      cy.clearCookies();
      customerLoginScenario.execute({
        email: dynamicFixtures.buyerForPause.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      recurringOrderListPage.visit();
      recurringOrderListPage.clickViewSchedule(staticFixtures.pausedScheduleName);

      recurringOrderDetailPage.clickResume();
      recurringOrderDetailPage.fillResumeDate(staticFixtures.resumeNextExecutionDate);
      recurringOrderDetailPage.confirmResume();

      recurringOrderDetailPage.assertStatusBadge('active');
    });

    it('company user can skip the next occurrence of a recurring schedule', (): void => {
      cy.clearCookies();
      customerLoginScenario.execute({
        email: dynamicFixtures.buyerForSkip.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      recurringOrderListPage.visit();
      recurringOrderListPage.clickViewSchedule(staticFixtures.skipScheduleName);

      recurringOrderDetailPage.clickSkipFromNextExecution();
      recurringOrderDetailPage.confirmSkip();

      cy.url().should('include', '/recurring-orders');
    });

    it('company user can cancel a recurring schedule (terminal action)', (): void => {
      recurringOrderListPage.openSchedule(staticFixtures.scheduleName);

      recurringOrderDetailPage.clickCancel();
      recurringOrderDetailPage.confirmCancel();

      recurringOrderDetailPage.assertStatusBadge('cancelled');
    });
  }
);
