import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductMeasurementUnitListRepository {
  getCreateButtonSelector = (): string => 'a[href*="/product-measurement-unit-gui/index/create"]';

  getEditButtonSelector = (): string => 'a[href*="/product-measurement-unit-gui/index/edit"]';

  getDeleteButtonSelector = (): string => '[data-qa="delete-button"]';

  getTableRowsSelector = (): string => '.dataTable tbody tr';

  getPaginationBarSelector = (): string => '.dt-paging';

  getTableCodeColumnSelector = (): string => '.dataTable thead th[data-qa="code"]';
}
