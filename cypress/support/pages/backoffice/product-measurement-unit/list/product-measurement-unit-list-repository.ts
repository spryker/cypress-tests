import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductMeasurementUnitListRepository {
  getCreateButtonSelector = (): string => 'a[href*="/product-measurement-unit-gui/index/create"]';

  getEditButtonSelector = (): string => 'a[href*="/product-measurement-unit-gui/index/edit"]';

  getDeleteButtonSelector = (): string => '[data-qa="delete-button"]';

  getTableRowsSelector = (): string => 'table.dataTable tbody tr';

  getPaginationBarSelector = (): string => '.dataTables_paginate';

  getTableCodeColumnSelector = (): string => 'table.dataTable thead th[data-qa="code"]';
}
