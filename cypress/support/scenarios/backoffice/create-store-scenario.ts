import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { StoreCreatePage, StoreListPage } from '@pages/backoffice';

@injectable()
@autoWired
export class CreateStoreScenario {
  @inject(StoreListPage) private storeListPage: StoreListPage;
  @inject(StoreCreatePage) private storeCreatePage: StoreCreatePage;

  execute = (params: ExecuteParams): void => {
    this.storeListPage.visit();
    const store = params.store;

    this.storeListPage.hasStore(store.name).then((isExists: boolean) => {
      if (!isExists) {
        this.storeListPage.createStore();
        this.storeCreatePage.create(store);

        if (params?.shouldTriggerPublishAndSync) {
          cy.runQueueWorker();
        }
      }
    });
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
