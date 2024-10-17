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
    this.listShipmentMethodPage.update({ query: params.shipmentMethod });

    this.editShipmentMethodPage.assignAllAvailableStore();
    this.editShipmentMethodPage.addPrices();

    this.editShipmentMethodPage.save();

    if (params?.shouldTriggerPublishAndSync) {
      cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
    }
  };
}

interface ExecuteParams {
  shipmentMethod: string;
  shouldTriggerPublishAndSync?: boolean;
}
