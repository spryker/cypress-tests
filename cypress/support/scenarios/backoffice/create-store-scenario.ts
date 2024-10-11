import { StoreCreatePage, StoreListPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class CreateStoreScenario {
  @inject(StoreListPage) private storeListPage: StoreListPage;
  @inject(StoreCreatePage) private storeCreatePage: StoreCreatePage;

  execute = (params: ExecuteParams): Store => {
    this.storeListPage.visit();
    const store = params.store;

    this.storeListPage.hasStoreByStoreName(store.name).then((isVisible) => {
      if (!isVisible) {
        this.storeListPage.createStore();
        this.storeCreatePage.create(store);

        if (params?.shouldTriggerPublishAndSync) {
          cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
        }
      }
    });

    return store;
  };
}

interface ExecuteParams {
  store: Store;
  shouldTriggerPublishAndSync?: boolean;
}

interface Store {
  name: string;
  locale: string;
  currency: string;
  country: string;
  timezone: string;
}