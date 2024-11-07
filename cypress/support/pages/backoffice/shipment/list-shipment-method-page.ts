import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ListShipmentMethodRepository } from './list-shipment-method-repository';

@injectable()
@autoWired
export class ListShipmentMethodPage extends BackofficePage {
  @inject(ListShipmentMethodRepository) private repository: ListShipmentMethodRepository;

  protected PAGE_URL = '/shipment-gui/shipment-method';

  rowIsAssignedToStore = (params: IsAssignedParams): boolean => {
    if (typeof params.storeName !== 'string') {
      return false;
    }

    return params.row.find(this.repository.getStoreCellSelector()).text().includes(params.storeName);
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
}

interface IsAssignedParams {
  row: JQuery<HTMLElement>;
  storeName?: string;
}
