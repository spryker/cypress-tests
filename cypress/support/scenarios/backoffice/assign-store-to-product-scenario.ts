import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import {
  CreateStoreScenario,
  EnableProductForAllStoresScenario,
  EnableWarehouseForAllStoresScenario,
  UserLoginScenario,
} from '@scenarios/backoffice';

@injectable()
@autoWired
export class AssignStoreToProductScenario {
  protected DEFAULT_WAREHOUSE_NAME = 'Warehouse1';
  protected DEFAULT_PRODUCT_PRICE = '300';

  @inject(UserLoginScenario) private userLoginScenario: UserLoginScenario;
  @inject(CreateStoreScenario) private createStoreScenario: CreateStoreScenario;
  @inject(EnableWarehouseForAllStoresScenario)
  private enableWarehouseForAllStoresScenario: EnableWarehouseForAllStoresScenario;
  @inject(EnableProductForAllStoresScenario)
  private enableProductForAllStoresScenario: EnableProductForAllStoresScenario;

  execute = (params: ExecuteParams): void => {
    this.userLoginScenario.execute({
      username: params.username,
      password: params.password,
    });

    this.createStoreScenario.execute({
      store: params.store,
      shouldTriggerPublishAndSync: params.shouldTriggerPublishAndSync,
    });

    this.enableWarehouseForAllStoresScenario.execute({
      warehouseName: params.warehouseName ?? this.DEFAULT_WAREHOUSE_NAME,
      storeName: params.store.name,
      shouldTriggerPublishAndSync: params.shouldTriggerPublishAndSync,
    });

    this.enableProductForAllStoresScenario.execute({
      abstractProductSku: params.abstractSku,
      storeName: params.store.name,
      productPrice: params.productPrice ?? this.DEFAULT_PRODUCT_PRICE,
      shouldTriggerPublishAndSync: params.shouldTriggerPublishAndSync,
    });
  };
}

interface ExecuteParams {
  username: string;
  password: string;
  store: Store;
  abstractSku: string;
  warehouseName?: string;
  productPrice?: string;
  shouldTriggerPublishAndSync?: boolean;
}

interface Store {
  name: string;
  locale: string;
  currency: string;
  country: string;
  timezone: string;
}
