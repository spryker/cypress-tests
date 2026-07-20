import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class RecurringScheduleListRepository {
  getTableBodySelector = (): string => 'table.gui-table-data tbody';
  getViewLinkSelector = (idRecurringSchedule: number): string =>
    `a[href*="/order-experience-management/recurring-schedule/view"][href*="id-recurring-schedule=${idRecurringSchedule}"]`;
}
