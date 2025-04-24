import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class SspAssetListRepository {
  getReferenceHeaderSelector = (): string => '[data-qa="spy_ssp_asset.reference"]';
  getImageHeaderSelector = (): string => '[data-qa="image"]';
  getNameHeaderSelector = (): string => '[data-qa="spy_ssp_asset.name"]';
  getSerialNumberHeaderSelector = (): string => '[data-qa="spy_ssp_asset.serial_number"]';
  getStatusHeaderSelector = (): string => '[data-qa="spy_ssp_asset.status"]';
  getCreatedDateHeaderSelector = (): string => '[data-qa="spy_ssp_asset.created_at"]';
  getCreateButtonSelector = (): string => '[href*="/ssp-asset-management/add"]';
  getSearchInputSelector = (): string => 'input[type="search"]';
  getStatusFilterSelector = (): string => 'form[name="ssp_asset_filter_form"] [name="filter[status]"]';
}
