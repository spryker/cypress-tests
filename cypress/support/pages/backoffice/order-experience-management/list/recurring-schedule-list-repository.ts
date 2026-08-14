import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class RecurringScheduleListRepository {
  getTableBodySelector = (): string => 'table.gui-table-data tbody';
  getViewLinkSelector = (idRecurringSchedule: number): string =>
    `a[href*="/order-experience-management/recurring-schedule/view"][href*="id-recurring-schedule=${idRecurringSchedule}"]`;
  getForecastSummarySelector = (): string => '[data-qa="recurring-schedule-forecast-summary"]';
  getForecastMonthSelector = (): string => '[data-qa="recurring-schedule-forecast-month"]';
  // Either a per-currency total (non-empty branch) or the explicit empty state renders — never neither.
  getForecastResultSelector = (): string =>
    '[data-qa="recurring-schedule-forecast-total"], [data-qa="recurring-schedule-forecast-empty"]';
}
