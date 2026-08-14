import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AuditLogsRepository {
  getSectionTitleSelector = (): string => '.page-title-head h2';

  getSectionTitleText = (): string => 'Audit Logs';

  getTotalInteractionsCardText = (): string => 'Total Interactions';

  getSuccessStatusText = (): string => 'Success';

  getStatsCardsSelector = (): string => '#stats-cards';

  getStatsCardTitleSelector = (): string => '#stats-cards .card .card-body h2';

  getTableSelector = (): string => '[data-qa="data-table"]';

  getTableWrapperSelector = (): string => '.dt-container.dt-bootstrap5';

  getTableHeaderSelector = (): string => '[data-qa="data-table"] thead th';

  getColumnHeaderSelector = (column: string): string => `[data-qa="data-table"] thead th[data-qa="${column}"]`;

  getSortableColumnHeaderSelector = (column: string): string =>
    `[data-qa="data-table"] thead th[data-qa="${column}"].dt-orderable-asc`;

  getNonSortableColumnHeaderSelector = (column: string): string =>
    `[data-qa="data-table"] thead th[data-qa="${column}"].dt-orderable-none`;

  getLengthSelectSelector = (): string => '.dt-length select';

  getTableInfoSelector = (): string => '.dt-info';

  getTableDataPath = (): string => '/ai-foundation/ai-interaction-log/table';
}
