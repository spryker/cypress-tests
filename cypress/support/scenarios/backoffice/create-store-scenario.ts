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
    const store = this.storeCreatePage.generateStore(params.store);

    this.storeListPage.hasStoreByStoreName(params.store).then((isVisible) => {
      if (!isVisible) {
        this.storeListPage.createStore();
        this.storeCreatePage.create({ store: store });

        if (params?.shouldTriggerPublishAndSync) {
          cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
        }
      }
    });

    return store;
  };
}

interface ExecuteParams {
  store: string;
  shouldTriggerPublishAndSync?: boolean;
}

interface Store {
  name: string;
  defaultLocale: string;
  defaultCurrency: string;
}
