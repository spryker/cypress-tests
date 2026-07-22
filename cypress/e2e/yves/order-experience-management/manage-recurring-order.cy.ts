import { container } from '@utils';
import { ManageRecurringOrderStaticFixtures, ManageRecurringOrderDynamicFixtures } from '@interfaces/yves';
import { RecurringOrderListPage, RecurringOrderDetailPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getFutureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);

  return formatDate(date);
}

describe(
  'recurring order management',
  { tags: ['@yves', '@order-experience-management', 'order-experience-management', 'spryker-core'] },
  (): void => {
    if (['b2c', 'b2c-mp', 'b2b'].includes(Cypress.env('repositoryId'))) {
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

    it('recurring orders list shows schedules of all statuses and shows actionable attention banner', (): void => {
      recurringOrderListPage.visit();

      recurringOrderListPage.assertListTableVisible();
      recurringOrderListPage.assertScheduleRowContains(dynamicFixtures.schedule.name, staticFixtures.statuses.active);
      recurringOrderListPage.assertScheduleRowContains(
        dynamicFixtures.pausedScheduleForBuyer.name,
        staticFixtures.statuses.paused
      );
      recurringOrderListPage.assertScheduleRowContains(
        dynamicFixtures.cancelledScheduleForBuyer.name,
        staticFixtures.statuses.cancelled
      );

      recurringOrderListPage.getRecurringOrdersAttentionBanner().should('be.visible');
      recurringOrderListPage.getRecurringOrdersAttentionBanner().should('contain', staticFixtures.attentionBannerText);

      recurringOrderListPage.getActionBannerFilter(staticFixtures.viewPausedFilterLabel).should('be.visible').click();

      recurringOrderListPage.assertScheduleListDoesNotContainScheduleWithStatus(staticFixtures.statuses.active);
      recurringOrderListPage.assertScheduleRowContains(
        dynamicFixtures.pausedScheduleForBuyer.name,
        staticFixtures.statuses.paused
      );
      recurringOrderListPage.assertScheduleListDoesNotContainScheduleWithStatus(staticFixtures.statuses.cancelled);
    });

    it('detail page shows the schedule name, cadence, and status', (): void => {
      recurringOrderListPage.openSchedule(dynamicFixtures.schedule.name);

      recurringOrderDetailPage.assertScheduleName(dynamicFixtures.schedule.name);
      recurringOrderDetailPage.assertCadenceVisible();
      recurringOrderDetailPage.assertStatusBadge(staticFixtures.statuses.active);
    });

    it('company user can edit the schedule cadence and start date from the detail page', (): void => {
      recurringOrderDetailPage.visitDetail(dynamicFixtures.schedule.uuid);

      recurringOrderDetailPage.openEditModal();
      recurringOrderDetailPage.selectCadence(staticFixtures.editCadenceType);
      recurringOrderDetailPage.setStartDate(getFutureDate(30));
      recurringOrderDetailPage.confirmEdit();

      recurringOrderDetailPage.assertScheduleName(dynamicFixtures.schedule.name);
      recurringOrderDetailPage.assertCadenceContains(staticFixtures.editCadenceLabel);
    });

    it('company user can pause an active recurring schedule and resume it', (): void => {
      recurringOrderListPage.openSchedule(dynamicFixtures.schedule.name);

      recurringOrderDetailPage.clickPause();
      recurringOrderDetailPage.confirmPause();
      recurringOrderDetailPage.assertStatusBadge(staticFixtures.statuses.paused);

      recurringOrderDetailPage.clickResume();
      recurringOrderDetailPage.fillResumeDate(getFutureDate(60));
      recurringOrderDetailPage.confirmResume();

      recurringOrderDetailPage.assertStatusBadge(staticFixtures.statuses.active);
    });

    it('company user can skip the next occurrence of a recurring schedule', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyerForSkip.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
        resetSession: true,
      });

      recurringOrderListPage.visit();
      recurringOrderListPage.clickViewSchedule(dynamicFixtures.scheduleForSkip.name);

      recurringOrderDetailPage.clickSkipFromNextExecution();
      recurringOrderDetailPage.confirmSkip();

      recurringOrderDetailPage.assertOnRecurringOrdersUrl();

      recurringOrderDetailPage.assertHistoryViewRecordStatus(staticFixtures.skippedHistoryStatus);
    });

    it('company user can cancel a recurring schedule (terminal action)', (): void => {
      recurringOrderListPage.openSchedule(dynamicFixtures.schedule.name);

      recurringOrderDetailPage.clickCancel();
      recurringOrderDetailPage.confirmCancel();

      recurringOrderDetailPage.assertStatusBadge(staticFixtures.statuses.cancelled);
    });
  }
);
