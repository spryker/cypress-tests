import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { EditPaymentMethodPage } from '../../pages/backoffice/payment-method/edit-payment-method-page';
import { ListPaymentMethodPage } from '../../pages/backoffice/payment-method/list-payment-method-page';

@injectable()
@autoWired
export class EnableAllPaymentMethodsForAllStoresScenario {
    @inject(ListPaymentMethodPage) private listPaymentMethodPage: ListPaymentMethodPage;
    @inject(EditPaymentMethodPage) private editPaymentMethodPage: EditPaymentMethodPage;

    execute = (params: ExecuteParams): void => {
        this.listPaymentMethodPage.visit();

        this.listPaymentMethodPage.getEditButton({
            searchQuery: params.paymentMethodName,
            tableUrl: 'payment-gui/payment-method/table**',
            rowFilter: [
                (row) => this.listPaymentMethodPage.rowIsAssignedToStore({ row, storeName: params.storeName }),
                (row) => row.find('td.shipment_method_key').text().trim() === params.paymentMethodKey
            ]
        }).then((editButton) => {
            if (editButton === null) {
                return;
            }

            editButton.click();

            this.editPaymentMethodPage.assignAllAvailableStore();
            this.editPaymentMethodPage.save();

            if (params?.shouldTriggerPublishAndSync) {
                cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
            }
        });
    };
}

interface ExecuteParams {
    paymentMethodKey: string;
    paymentMethodName: string;
    shouldTriggerPublishAndSync?: boolean;
    storeName?: string;
}
