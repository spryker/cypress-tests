import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ActionEnum, BackofficePage } from '@pages/backoffice';
import { ListPaymentMethodRepository } from './list-payment-method-repository';

@injectable()
@autoWired
export class ListPaymentMethodPage extends BackofficePage {
  @inject(ListPaymentMethodRepository) private repository: ListPaymentMethodRepository;

  protected PAGE_URL = '/payment-gui/payment-method';

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
