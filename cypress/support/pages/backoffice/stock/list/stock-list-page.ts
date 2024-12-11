import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { StockListRepository } from './stock-list-repository';

@injectable()
@autoWired
export class StockListPage extends BackofficePage {
  @inject(StockListRepository) private repository: StockListRepository;

  protected PAGE_URL = '/stock-gui/warehouse/list';

  getEditButtonSelector = (): string => {
    return this.repository.getEditButtonSelector();
  };

  rowIsAssignedToStore = (params: IsAssignedParams): boolean => {
    if (typeof params.storeName !== 'string') {
      return false;
    }

    return params.row.find(this.repository.getStoreCellSelector()).text().includes(params.storeName);
  };
}

interface IsAssignedParams {
  row: JQuery<HTMLElement>;
  storeName?: string;
}
