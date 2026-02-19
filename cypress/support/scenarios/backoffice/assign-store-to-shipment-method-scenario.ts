import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ShipmentMethodEditPage, ShipmentMethodListPage } from '@pages/backoffice';

@injectable()
@autoWired
export class AssignStoreToShipmentMethodScenario {
  @inject(ShipmentMethodListPage) private shipmentMethodListPage: ShipmentMethodListPage;
  @inject(ShipmentMethodEditPage) private shipmentMethodEditPage: ShipmentMethodEditPage;

  execute = (params: ExecuteParams): void => {
    this.shipmentMethodListPage.visit();
    this.shipmentMethodListPage
      .find({
        searchQuery: params.shipmentMethodName,
        interceptTableUrl: `**/shipment-gui/shipment-method/table**${params.shipmentMethodName}**`,
        rowFilter: [
          (row): boolean => !this.shipmentMethodListPage.rowIsAssignedToStore({ row, storeName: params.storeName }),
          (row): boolean =>
            row.find(this.shipmentMethodListPage.getMethodKeyRowSelector()).text().trim() === params.shipmentMethodKey,
        ],
      })
      .then(($row) => {
        if ($row === null) {
          return;
        }

        cy.wrap($row).find(this.shipmentMethodListPage.getEditButtonSelector()).as('editButton');
        cy.get('@editButton').click();

        this.shipmentMethodEditPage.assignAllAvailableStore();
        this.shipmentMethodEditPage.addPrices();
        this.shipmentMethodEditPage.save();

        if (params?.shouldTriggerPublishAndSync) {
          cy.runQueueWorker();
        }
      });
  };
}

interface ExecuteParams {
  shipmentMethodName: string;
  shipmentMethodKey: string;
  storeName?: string;
  shouldTriggerPublishAndSync?: boolean;
}
