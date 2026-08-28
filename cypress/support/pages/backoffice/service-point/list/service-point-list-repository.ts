import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ServicePointListRepository {
  getTableRowsSelector = (): string => 'table.dataTable tbody tr';

  getAddressColumnSelector = (): string => 'table.dataTable thead th[data-qa="address"]';

  getStoresColumnSelector = (): string => 'table.dataTable thead th[data-qa="stores"]';

  getServiceTypesColumnSelector = (): string => 'table.dataTable thead th[data-qa="service_types"]';

  getViewButtonSelector = (): string => 'a[href*="/service-point/view"]';
}
