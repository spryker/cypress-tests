import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductOfferListRepository {
  getCreateButtonSelector = (): string => 'a[href*="/self-service-portal/create-offer"]';

  getEditButtonSelector = (): string => 'a[href*="/self-service-portal/edit-offer?id_product_offer=156"]';

  getTableRowsSelector = (): string => 'table.dataTable tbody tr';

  getSearchFieldSelector = (): string => '[data-qa="table-search"]';

  getViewButtonSelector = (): string => 'a[href*="/product-offer-gui/view"]';

  getReferenceColumnSelector = (): string => 'td:nth-child(1)';

  getSkuColumnSelector = (): string => 'td:nth-child(2)';
}
