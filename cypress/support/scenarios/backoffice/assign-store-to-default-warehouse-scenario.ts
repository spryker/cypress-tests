import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { AssignStoreToWarehouseScenario } from '@scenarios/backoffice';

@injectable()
@autoWired
export class AssignStoreToDefaultWarehouseScenario {
  @inject(AssignStoreToWarehouseScenario) private assignStoreToWarehouseScenario: AssignStoreToWarehouseScenario;

  DEFAULT_WAREHOUSE = 'Warehouse1';

  execute = (params: ExecuteParams): void => {
    this.assignStoreToWarehouseScenario.execute({
      warehouseName: this.DEFAULT_WAREHOUSE,
      storeName: params.storeName,
      shouldTriggerPublishAndSync: params.shouldTriggerPublishAndSync,
    });
  };
}

interface ExecuteParams {
  storeName?: string;
  shouldTriggerPublishAndSync?: boolean;
}
