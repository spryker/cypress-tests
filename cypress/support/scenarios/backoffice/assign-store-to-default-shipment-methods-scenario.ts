import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { AssignStoreToShipmentMethodScenario } from '@scenarios/backoffice';

@injectable()
@autoWired
export class AssignStoreToDefaultShipmentMethodsScenario {
  @inject(AssignStoreToShipmentMethodScenario)
  private assignStoreToShipmentMethodScenario: AssignStoreToShipmentMethodScenario;

  DEFAULT_SHIPMENT_METHODS = [
    {
      key: 'spryker_dummy_shipment-standard',
      name: 'Standard',
    },
    {
      key: 'spryker_dummy_shipment-express',
      name: 'Express',
    },
  ];

  execute = (params: ExecuteParams): void => {
    this.DEFAULT_SHIPMENT_METHODS.forEach((shipmentMethod) => {
      this.assignStoreToShipmentMethodScenario.execute({
        storeName: params.storeName,
        shipmentMethodName: shipmentMethod.name,
        shipmentMethodKey: shipmentMethod.key,
        shouldTriggerPublishAndSync: params.shouldTriggerPublishAndSync,
      });
    });
  };
}

interface ExecuteParams {
  storeName: string;
  shouldTriggerPublishAndSync?: boolean;
}
