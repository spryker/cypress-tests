import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { EditShipmentMethodPage } from '../../pages/backoffice/shipment/edit-shipment-method-page';
import { ListShipmentMethodPage } from '../../pages/backoffice/shipment/list-shipment-method-page';

@injectable()
@autoWired
export class EnableAllShipmentMethodsForAllStoresScenario {
  @inject(ListShipmentMethodPage) private listShipmentMethodPage: ListShipmentMethodPage;
  @inject(EditShipmentMethodPage) private editShipmentMethodPage: EditShipmentMethodPage;

    execute = (params: ExecuteParams): void => {
        this.listShipmentMethodPage.visit();

        this.listShipmentMethodPage.getEditButton({
            searchQuery: params.shipmentMethod,
            tableUrl: 'shipment-gui/shipment-method/table**',
            rowFilter: [
                (row) => this.listShipmentMethodPage.rowIsAssignedToStore({ row, storeName: params.storeName }),
                (row) => row.find('td.shipment_method_key').text().trim() === params.shipmentMethodKey
            ]
        }).then((editButton) => {
            if (editButton === null) {
                return;
            }

            editButton.click();

            this.editShipmentMethodPage.assignAllAvailableStore();
            this.editShipmentMethodPage.addPrices();
            this.editShipmentMethodPage.save();

            if (params?.shouldTriggerPublishAndSync) {
                cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
            }
        });
    };
}

interface ExecuteParams {
  storeName?: string;
  shipmentMethod: string;
  shipmentMethodKey: string;
  shouldTriggerPublishAndSync?: boolean;
}
