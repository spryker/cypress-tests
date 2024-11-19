import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { PaymentMethodEditRepository } from './payment-method-edit-repository';
import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class PaymentMethodEditPage extends BackofficePage {
  @inject(PaymentMethodEditRepository) private repository: PaymentMethodEditRepository;

  assignAllAvailableStore = (): void => {
    this.repository.getStoreRelationTab().click();
    this.repository.getAllAvailableStoresInputs().check();
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };
}
