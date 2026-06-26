import { injectable } from 'inversify';
import { AiWorkflowsRepository } from '../ai-workflows-repository';

/**
 * The AiFoundation Workflows page (`AiWorkflowController::indexAction`) reuses the core Back Office
 * layout and the Gui DataTable, so the page title falls back to the stable layout structure
 * (`@Gui/Layout/layout.twig` page header `.page-title-head h2` → "Workflows") and the widget title
 * to the Gui widget partial (`.ibox-title h5` → "Workflow Items"). The table and its column headers
 * expose real `data-qa` hooks:
 *   - the DataTable shell carries `data-qa="data-table"` (Gui AbstractTable / index.twig),
 *   - each `<th>` carries `data-qa="<column>"` (Gui thead.twig uses the header key as id+data-qa)
 *     from `AiWorkflowItemTable::configure()`, e.g. `process_name`, `state_name`, `Actions`, and the
 *     table-map columns `spy_ai_workflow_item.id_ai_workflow_item` / `.created_at` / `.updated_at`.
 * See:
 *   vendor/spryker/gui/.../Presentation/Layout/layout.twig
 *   vendor/spryker/gui/.../Presentation/Table/{index,thead}.twig
 *   vendor/spryker/ai-foundation/.../Communication/Table/AiWorkflowItemTable.php
 *   vendor/spryker/ai-foundation/.../Presentation/AiWorkflow/index.twig
 */
@injectable()
export class SuiteAiWorkflowsRepository implements AiWorkflowsRepository {
  getSectionTitleSelector = (): string => '.page-title-head h2';

  getWidgetTitleSelector = (): string => '.ibox-title h5';

  getTableSelector = (): string => '[data-qa="data-table"]';

  getTableHeaderSelector = (): string => '[data-qa="data-table"] thead th';

  getColumnHeaderSelector = (column: string): string => `[data-qa="data-table"] thead th[data-qa="${column}"]`;
}
