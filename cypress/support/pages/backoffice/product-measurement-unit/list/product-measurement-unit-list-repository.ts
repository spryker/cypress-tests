import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductMeasurementUnitListRepository {
  getSearchSelector = (): string => '[type="search"]';

  getCreateButtonSelector = (): string => '.btn-create';

  getEditButtonSelector = (): string => '.btn-edit';

  getDeleteButtonSelector = (): string => '[data-qa="delete-button"]';

  getTableRowsSelector = (): string => 'table.dataTable tbody tr';

  getPaginationBarSelector = (): string => '.dataTables_paginate';

  getTableCodeColumnSelector = (): string => 'table.dataTable thead th[data-qa="code"]';
}
