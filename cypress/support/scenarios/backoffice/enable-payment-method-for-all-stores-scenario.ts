import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { EditPaymentMethodPage } from '../../pages/backoffice/payment-method/edit-payment-method-page';
import { ListPaymentMethodPage } from '../../pages/backoffice/payment-method/list-payment-method-page';

@injectable()
@autoWired
export class EnablePaymentMethodForAllStoresScenario {
  @inject(ListPaymentMethodPage) private listPaymentMethodPage: ListPaymentMethodPage;
  @inject(EditPaymentMethodPage) private editPaymentMethodPage: EditPaymentMethodPage;

  execute = (params: ExecuteParams): void => {
    this.listPaymentMethodPage.visit();
    this.listPaymentMethodPage.update({ query: params.paymentMethod });

    this.editPaymentMethodPage.assignAllAvailableStore();

    this.editPaymentMethodPage.save();

    if (params?.shouldTriggerPublishAndSync) {
      cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
    }
  };
}

interface ExecuteParams {
  paymentMethod: string;
  shouldTriggerPublishAndSync?: boolean;
}
