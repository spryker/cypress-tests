import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
// import { ActionEnum, BackofficePage } from '@pages/backoffice';
import { EditPaymentMethodRepository } from './edit-payment-method-repository';
import { BackofficePage } from '@pages/backoffice';
@injectable()
@autoWired
export class EditPaymentMethodPage extends BackofficePage {
  @inject(EditPaymentMethodRepository) private repository: EditPaymentMethodRepository;

  assignAllAvailableStore = (): void => {
    this.repository.getStoreRelationTab().click();
    this.repository.getAllAvailableStoresInputs().check();
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };
}
//
// interface FindParams {
//   query: string;
//   expectedCount?: number;
// }
//
// interface UpdateParams {
//   action: ActionEnum;
//   query: string;
// }
