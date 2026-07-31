import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AuditLogsRepository {
  getSectionTitleSelector = (): string => '.page-title-head h2';

  getStatsCardsSelector = (): string => '#stats-cards';

  getStatsCardTitleSelector = (): string => '#stats-cards .card .card-body h2';

  getTableSelector = (): string => '[data-qa="data-table"]';

  getTableHeaderSelector = (): string => '[data-qa="data-table"] thead th';

  getColumnHeaderSelector = (column: string): string => `[data-qa="data-table"] thead th[data-qa="${column}"]`;
}
