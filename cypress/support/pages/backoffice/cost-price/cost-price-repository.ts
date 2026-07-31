import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CostPriceRepository {
  getPriceTableSelector = (): string => '#price-table-collection';

  getPriceTableHeaderSelector = (): string => '#price-table-collection thead th';

  getCostAmountInputSelector = (): string => '#price-table-collection input[name*="cost_amount"]';

  getCostPriceViewRowSelector = (): string => 'b';

  getPriceTaxWidgetSelector = (): string => '.ibox-title h5';
}
