import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { MerchantListPage, MerchantUpdatePage } from '@pages/backoffice';

@injectable()
@autoWired
export class AssignStoreToMerchantScenario {
  @inject(MerchantUpdatePage) private merchantUpdatePage: MerchantUpdatePage;
  @inject(MerchantListPage) private merchantListPage: MerchantListPage;

  execute = (params: ExecuteParams): void => {
    this.merchantListPage.visit();
    this.merchantListPage
      .find({
        searchQuery: params.merchantName,
        tableUrl: '/merchant-gui/list-merchant/table**',
      })
      .then(($row) => {
        const isStoreAssigned = this.merchantListPage.rowIsAssignedToStore({
          row: $row,
          storeName: params.storeName,
        });

        this.merchantListPage.clickEditAction($row);

        if (isStoreAssigned) {
          return;
        }

        this.merchantUpdatePage.assignAllAvailableStore();

        if (params.shouldTriggerPublishAndSync) {
          cy.runQueueWorker();
        }
      });
  };
}

interface ExecuteParams {
  merchantName: string;
  storeName?: string;
  shouldTriggerPublishAndSync?: boolean;
}
