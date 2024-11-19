import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { PaymentMethodListRepository } from './payment-method-list-repository';

@injectable()
@autoWired
export class PaymentMethodListPage extends BackofficePage {
  @inject(PaymentMethodListRepository) private repository: PaymentMethodListRepository;

  protected PAGE_URL = '/payment-gui/payment-method';

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
