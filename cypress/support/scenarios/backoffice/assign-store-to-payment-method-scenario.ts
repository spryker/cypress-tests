import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { PaymentMethodListPage, PaymentMethodEditPage } from '@pages/backoffice';

@injectable()
@autoWired
export class AssignStoreToPaymentMethodScenario {
  @inject(PaymentMethodListPage) private listPaymentMethodPage: PaymentMethodListPage;
  @inject(PaymentMethodEditPage) private editPaymentMethodPage: PaymentMethodEditPage;

  execute = (params: ExecuteParams): void => {
    this.listPaymentMethodPage.visit();
    this.listPaymentMethodPage
      .find({
        searchQuery: params.paymentMethodName,
        interceptTableUrl: `**/payment-gui/payment-method/table**`,
        rowFilter: [
          (row): boolean => !this.listPaymentMethodPage.rowIsAssignedToStore({ row, storeName: params.storeName }),
          (row): boolean =>
            row.find(this.listPaymentMethodPage.getMethodKeyRowSelector()).text().trim() === params.paymentMethodKey,
        ],
      })
      .then(($row) => {
        if ($row === null) {
          return;
        }

        cy.wrap($row).find(this.listPaymentMethodPage.getEditButtonSelector()).click();

        this.editPaymentMethodPage.assignAllAvailableStore();
        this.editPaymentMethodPage.save();

        if (params?.shouldTriggerPublishAndSync) {
          cy.runQueueWorker();
        }
      });
  };
}

interface ExecuteParams {
  paymentMethodName: string;
  paymentMethodKey: string;
  shouldTriggerPublishAndSync?: boolean;
  storeName?: string;
}
