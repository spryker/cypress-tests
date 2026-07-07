import { container } from '@utils';
import { ManageRecurringOrderStaticFixtures, ManageRecurringOrderDynamicFixtures } from '@interfaces/yves';
import { RecurringOrderListPage, RecurringOrderDetailPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

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

      recurringOrderListPage.getListTable().should('be.visible');
      recurringOrderListPage
        .getListTable()
        .contains('tr', dynamicFixtures.schedule.name)
        .invoke('text')
        .invoke('toLowerCase')
        .should('contain', 'active');
      recurringOrderListPage
        .getListTable()
        .contains('tr', dynamicFixtures.pausedScheduleForBuyer.name)
        .invoke('text')
        .invoke('toLowerCase')
        .should('contain', 'paused');
      recurringOrderListPage
        .getListTable()
        .contains('tr', dynamicFixtures.cancelledScheduleForBuyer.name)
        .invoke('text')
        .invoke('toLowerCase')
        .should('contain', 'cancelled');

      recurringOrderListPage.getRecurringOrdersAttentionBanner().should('be.visible');
      recurringOrderListPage
        .getRecurringOrdersAttentionBanner()
        .should('contain', 'You have 1 recurring schedule(s) that require your attention.');

      recurringOrderListPage.getActionBannerFilter('View Paused').should('be.visible').click();

      recurringOrderListPage.getListTable().invoke('text').invoke('toLowerCase').should('not.contain', 'active');
      recurringOrderListPage
        .getListTable()
        .contains('tr', dynamicFixtures.pausedScheduleForBuyer.name)
        .invoke('text')
        .invoke('toLowerCase')
        .should('contain', 'paused');
      recurringOrderListPage.getListTable().invoke('text').invoke('toLowerCase').should('not.contain', 'cancelled');
    });

    it('detail page shows the schedule name, cadence, and status', (): void => {
      recurringOrderListPage.openSchedule(dynamicFixtures.schedule.name);

      recurringOrderDetailPage.getScheduleName().should('contain', dynamicFixtures.schedule.name);
      recurringOrderDetailPage.getCadence().should('be.visible');
      recurringOrderDetailPage.getStatusBadge().invoke('text').invoke('toLowerCase').should('contain', 'active');
    });

    it('company user can pause an active recurring schedule and resume it', (): void => {
      recurringOrderListPage.openSchedule(dynamicFixtures.schedule.name);

      recurringOrderDetailPage.clickPause();
      recurringOrderDetailPage.confirmPause();
      recurringOrderDetailPage.getStatusBadge().invoke('text').invoke('toLowerCase').should('contain', 'paused');

      recurringOrderDetailPage.clickResume();
      recurringOrderDetailPage.fillResumeDate(staticFixtures.resumeNextExecutionDate);
      recurringOrderDetailPage.confirmResume();

      recurringOrderDetailPage.getStatusBadge().invoke('text').invoke('toLowerCase').should('contain', 'active');
    });

    it('company user can skip the next occurrence of a recurring schedule', (): void => {
      cy.clearCookies();
      customerLoginScenario.execute({
        email: dynamicFixtures.buyerForSkip.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      recurringOrderListPage.visit();
      recurringOrderListPage.clickViewSchedule(dynamicFixtures.scheduleForSkip.name);

      recurringOrderDetailPage.clickSkipFromNextExecution();
      recurringOrderDetailPage.confirmSkip();

      cy.url().should('include', '/recurring-orders');

      recurringOrderDetailPage.assertHistoryViewRecordStatus('Skipped');
    });

    it('company user can cancel a recurring schedule (terminal action)', (): void => {
      recurringOrderListPage.openSchedule(dynamicFixtures.schedule.name);

      recurringOrderDetailPage.clickCancel();
      recurringOrderDetailPage.confirmCancel();

      recurringOrderDetailPage.getStatusBadge().invoke('text').invoke('toLowerCase').should('contain', 'cancelled');
    });
  }
);
