import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AiWorkflowsRepository {
  getSectionTitleSelector = (): string => '.page-title-head h2';

  getWidgetTitleSelector = (): string => '.ibox-title h5';

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
}
