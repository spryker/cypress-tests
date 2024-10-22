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

        this.listPaymentMethodPage.find({ query: params.paymentMethod }).its('length').then((count) => {
            for (let index = 0; index < count; index++) {
                this.listPaymentMethodPage.find({ query: params.paymentMethod }).eq(index).then(($storeRow) => {
                    cy.wrap($storeRow).find('a:contains("Edit")').should('exist').click();

                    // Perform the necessary update actions here
                    this.editPaymentMethodPage.assignAllAvailableStore();
                    this.editPaymentMethodPage.save();

                    // Go back to the list page to update the next payment method
                    this.listPaymentMethodPage.visit();
                });
            }
        });

        if (params?.shouldTriggerPublishAndSync) {
            cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
        }
    };
}

interface ExecuteParams {
  paymentMethod: string;
  shouldTriggerPublishAndSync?: boolean;
}
