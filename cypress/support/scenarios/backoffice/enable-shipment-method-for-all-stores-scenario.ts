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
        const initialShipments = this.listShipmentMethodPage.find({ query: params.shipmentMethod });

        initialShipments.first().should('exist').then(($storeRow) => {
            cy.wrap($storeRow).find('a:contains("Edit")').should('exist').click();

            // Perform the necessary update actions here
            this.editShipmentMethodPage.assignAllAvailableStore();
            this.editShipmentMethodPage.addPrices();
            this.editShipmentMethodPage.save();

            this.listShipmentMethodPage.visit();
        });

        initialShipments.should('exist').its('length').then((count) => {
            for (let index = 1; index < count; index++) {
                this.listShipmentMethodPage.find({ query: params.shipmentMethod }).should('exist').eq(index).should('exist').then(($storeRow) => {
                    cy.wrap($storeRow).find('a:contains("Edit")').should('exist').click();

                    // Perform the necessary update actions here
                    this.editShipmentMethodPage.assignAllAvailableStore();
                    this.editShipmentMethodPage.addPrices();
                    this.editShipmentMethodPage.save();

                    this.listShipmentMethodPage.visit();
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
