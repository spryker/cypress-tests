import { container } from '@utils';
import {
  BackofficeRecurringScheduleStaticFixtures,
  BackofficeRecurringScheduleDynamicFixtures,
} from '@interfaces/backoffice';
import { RecurringScheduleListPage, RecurringScheduleViewPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'backoffice recurring order schedules',
  {
    tags: [
      '@backoffice',
      '@order-experience-management',
      'order-experience-management',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped because tests run only for suite', () => {});

      return;
    }

    const recurringScheduleListPage = container.get(RecurringScheduleListPage);
    const recurringScheduleViewPage = container.get(RecurringScheduleViewPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: BackofficeRecurringScheduleStaticFixtures;
    let dynamicFixtures: BackofficeRecurringScheduleDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('backoffice user can find a recurring schedule in the list and open its detail', (): void => {
      recurringScheduleListPage.waitForTable();
      recurringScheduleListPage.searchByName(dynamicFixtures.activeSchedule.name);
      recurringScheduleListPage.openView(dynamicFixtures.activeSchedule.id_recurring_schedule);

      recurringScheduleViewPage.assertName(dynamicFixtures.activeSchedule.name);
      recurringScheduleViewPage.assertStatus(staticFixtures.activeStatus);
      recurringScheduleViewPage.assertItemsContain(dynamicFixtures.product.sku);
    });

    it('backoffice user can filter the recurring schedules by status', (): void => {
      recurringScheduleListPage.filterByStatus(staticFixtures.pausedStatus);

      recurringScheduleListPage.assertScheduleInTable(dynamicFixtures.pausedSchedule.name);
      recurringScheduleListPage.assertScheduleNotInTable(dynamicFixtures.activeSchedule.name);
    });

    it('backoffice user can search recurring schedules by name', (): void => {
      recurringScheduleListPage.waitForTable();
      recurringScheduleListPage.searchByName(dynamicFixtures.activeSchedule.name);

      recurringScheduleListPage.assertScheduleInTable(dynamicFixtures.activeSchedule.name);
      recurringScheduleListPage.assertScheduleNotInTable(dynamicFixtures.pausedSchedule.name);
    });

    it('backoffice user sees the committed recurring volume statistic widget on the list page', (): void => {
      recurringScheduleListPage.waitForTable();

      recurringScheduleListPage.assertForecastWidgetVisible();
      recurringScheduleListPage.assertForecastMonthContains(staticFixtures.forecastWidgetMonthText);
      recurringScheduleListPage.assertForecastResultVisible();
    });
  }
);
