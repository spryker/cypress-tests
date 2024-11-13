import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { StoreCreatePage, StoreListPage } from '@pages/backoffice';

@injectable()
@autoWired
export class CreateStoreScenario {
  @inject(StoreListPage) private storeListPage: StoreListPage;
  @inject(StoreCreatePage) private storeCreatePage: StoreCreatePage;

    execute = (params: ExecuteParams): Store => {
        this.storeListPage.visit();
        const store = params.store;

        return this.storeListPage.hasStoreByStoreName(store.name).then((isVisible) => {
            if (!isVisible) {
                this.storeListPage.createStore();
                this.storeCreatePage.create(store);

                return cy.runCliCommands(['console queue:worker:start --stop-when-empty']).then(() => {
                    return store;
                });
            }
            return store;
        });
    }
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
