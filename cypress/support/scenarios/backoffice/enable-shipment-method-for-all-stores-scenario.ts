import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { EditShipmentMethodPage } from '../../pages/backoffice/shipment/edit-shipment-method-page';
import { ListShipmentMethodPage } from '../../pages/backoffice/shipment/list-shipment-method-page';

@injectable()
@autoWired
export class EnableShipmentMethodForAllStoresScenario {
  @inject(ListShipmentMethodPage) private listShipmentMethodPage: ListShipmentMethodPage;
  @inject(EditShipmentMethodPage) private editShipmentMethodPage: EditShipmentMethodPage;

    execute = (params: ExecuteParams): void => {
        this.listShipmentMethodPage.visit();

        // Waits for shipments to load
        this.listShipmentMethodPage.interceptTable({ url: 'shipment-gui/shipment-method/table**' });

        this.listShipmentMethodPage.find({ query: params.shipmentMethod }).its('length').then((count) => {
            for (let index = 0; index < count; index++) {
                this.listShipmentMethodPage.find({ query: params.shipmentMethod }).eq(index).should('exist').then(($storeRow) => {
                    cy.wrap($storeRow).find('a:contains("Edit")').should('exist').click();

                    // Perform the necessary update actions here
                    this.editShipmentMethodPage.assignAllAvailableStore();
                    this.editShipmentMethodPage.addPrices();
                    this.editShipmentMethodPage.save();

                    // Go back to the list page to update the next shipment method
                    this.listShipmentMethodPage.visit();

                    // Waits for shipments to load again
                    this.listShipmentMethodPage.interceptTable({ url: 'shipment-gui/shipment-method/table**' });
                });
            }
        });

        if (params?.shouldTriggerPublishAndSync) {
            cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
        }
    };
}

interface ExecuteParams {
  shipmentMethod: string;
  shouldTriggerPublishAndSync?: boolean;
}
