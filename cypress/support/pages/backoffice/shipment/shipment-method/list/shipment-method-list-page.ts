import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ShipmentMethodListRepository } from './shipment-method-list-repository';

@injectable()
@autoWired
export class ShipmentMethodListPage extends BackofficePage {
  @inject(ShipmentMethodListRepository) private repository: ShipmentMethodListRepository;

  protected PAGE_URL = '/shipment-gui/shipment-method';

  getEditButtonSelector = (): string => {
    return this.repository.getEditButtonSelector();
  };

  getMethodKeyRowSelector = (): string => {
    return this.repository.getMethodKeyRowSelector();
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
