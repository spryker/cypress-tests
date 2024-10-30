import { ActionEnum, MerchantUpdatePage, MerchantListPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class EnableMerchantForAllStoresScenario {
  @inject(MerchantUpdatePage) private merchantUpdatePage: MerchantUpdatePage;
  @inject(MerchantListPage) private merchantListPage: MerchantListPage;

  execute = (params: ExecuteParams): void => {
    this.merchantListPage.visit();

    this.merchantListPage.find({ query: params.merchantName, expectedCount: 1 }).then(($row) => {
      if (!this.merchantListPage.rowIsAssignedToStore({ row: $row, storeName: params.storeName })) {
        this.merchantListPage.clickEditAction($row);

        this.merchantUpdatePage.assignAllAvailableStore();

        cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
      }
    });
  };
}

interface ExecuteParams {
  merchantName: string;
  shouldTriggerPublishAndSync?: boolean;
  storeName?: string;
}
