import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { AssignStoreToDefaultShipmentMethodsScenario } from './assign-store-to-default-shipment-methods-scenario';
import { AssignStoreToPaymentMethodsScenario } from './assign-store-to-default-payment-methods-scenario';
import { AssignStoreToDefaultShipmentTypesScenario } from './assign-store-to-default-shipment-types-scenario';
import { AssignStoreToDefaultWarehouseScenario } from './assign-store-to-default-warehouse-scenario';

@injectable()
@autoWired
export class SetupDefaultStoreRelationsScenario {
  @inject(AssignStoreToDefaultWarehouseScenario)
  private assignStoreToDefaultWarehouseScenario: AssignStoreToDefaultWarehouseScenario;
  @inject(AssignStoreToDefaultShipmentMethodsScenario)
  private assignStoreToDefaultShipmentMethodsScenario: AssignStoreToDefaultShipmentMethodsScenario;
  @inject(AssignStoreToPaymentMethodsScenario)
  private assignStoreToPaymentMethodsScenario: AssignStoreToPaymentMethodsScenario;
  @inject(AssignStoreToDefaultShipmentTypesScenario)
  private assignStoreToDefaultShipmentTypesScenario: AssignStoreToDefaultShipmentTypesScenario;

  execute = (params: ExecuteParams): void => {
    this.assignStoreToDefaultWarehouseScenario.execute({
      storeName: params.storeName,
      shouldTriggerPublishAndSync: true,
    });

    this.assignStoreToDefaultShipmentMethodsScenario.execute({
      storeName: params.storeName,
      shouldTriggerPublishAndSync: true,
    });

    this.assignStoreToPaymentMethodsScenario.execute({
      storeName: params.storeName,
      shouldTriggerPublishAndSync: true,
      paymentMethods: params.paymentMethods,
    });

    if (['suite', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      this.assignStoreToDefaultShipmentTypesScenario.execute({
        store: params.storeName,
        username: params.rootUser.username,
        password: params.rootUser.password,
      });
    }
  };
}

interface ExecuteParams {
  storeName: string;
  paymentMethods: PaymentMethod[];
  rootUser: User;
}

interface PaymentMethod {
  key: string;
  name: string;
}

interface User {
  username: string;
  password: string;
}
