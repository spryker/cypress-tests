import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AiWorkflowsRepository {
  getSectionTitleSelector = (): string => '.page-title-head h2';

  getWidgetTitleSelector = (): string => '.ibox-title h5';

  getTableSelector = (): string => '[data-qa="data-table"]';

  getTableHeaderSelector = (): string => '[data-qa="data-table"] thead th';

  getColumnHeaderSelector = (column: string): string => `[data-qa="data-table"] thead th[data-qa="${column}"]`;
}
