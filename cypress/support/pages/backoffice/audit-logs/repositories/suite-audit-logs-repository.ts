import { injectable } from 'inversify';
import { AuditLogsRepository } from '../audit-logs-repository';

/**
 * The AiFoundation Audit Logs page reuses the core Back Office layout and the Gui DataTable,
 * so the page title falls back to the stable layout structure (`@Gui/Layout/layout.twig`
 * page header) while the table and its column headers expose real `data-qa` hooks:
 *   - the DataTable shell carries `data-qa="data-table"` (Gui AbstractTable),
 *   - each `<th>` carries `data-qa="<column>"` (e.g. `estimated_cost`, `total_tokens`,
 *     `spy_ai_interaction_log.provider`) from `AiInteractionLogTable::configure()`.
 * The stats cards partial wraps its five cards in `#stats-cards`. See:
 *   vendor/spryker/gui/.../Presentation/Layout/layout.twig
 *   vendor/spryker/ai-foundation/.../Communication/Table/AiInteractionLogTable.php
 *   vendor/spryker/ai-foundation/.../Presentation/Partials/ai-interaction-log-stats-cards.twig
 */
@injectable()
export class SuiteAuditLogsRepository implements AuditLogsRepository {
  getSectionTitleSelector = (): string => '.page-title-head h2';

  getStatsCardsSelector = (): string => '#stats-cards';

  getStatsCardTitleSelector = (): string => '#stats-cards .card .card-body h2';

  getTableSelector = (): string => '[data-qa="data-table"]';

  getTableHeaderSelector = (): string => '[data-qa="data-table"] thead th';

  getColumnHeaderSelector = (column: string): string => `[data-qa="data-table"] thead th[data-qa="${column}"]`;
}
