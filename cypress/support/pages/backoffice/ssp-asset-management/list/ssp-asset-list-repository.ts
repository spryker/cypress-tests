import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class SspAssetListRepository {
  getReferenceHeaderSelector = (): string => 'th[data-qa="spy_ssp_asset.reference"]';
  getImageHeaderSelector = (): string => 'th[data-qa="image"]';
  getNameHeaderSelector = (): string => 'th[data-qa="spy_ssp_asset.name"]';
  getSerialNumberHeaderSelector = (): string => 'th[data-qa="spy_ssp_asset.serial_number"]';
  getStatusHeaderSelector = (): string => 'th[data-qa="spy_ssp_asset.status"]';
  getCreatedDateHeaderSelector = (): string => 'th[data-qa="spy_ssp_asset.created_at"]';
  getCreateButtonSelector = (): string => 'a.btn-create';
  getViewButtonSelector = (): string => 'a.btn-view';
  getEditButtonSelector = (): string => 'a.btn-edit';
  getSearchInputSelector = (): string => 'div.dataTables_filter input[type="search"]';
  getStatusFilterSelector = (): string => 'select[name="filter[status]"]';
  getApplyFilterButtonSelector = (): string => 'button.filter-btn';
  getTableCellSelector = (): string => 'table.dataTable td';
}
