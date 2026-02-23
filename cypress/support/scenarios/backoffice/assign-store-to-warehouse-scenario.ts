import { StockEditPage, StockListPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class AssignStoreToWarehouseScenario {
  @inject(StockEditPage) private stockEditPage: StockEditPage;
  @inject(StockListPage) private stockListPage: StockListPage;

  execute = (params: ExecuteParams): void => {
    this.stockListPage.visit();
    this.stockListPage
      .find({
        searchQuery: params.warehouseName,
        interceptTableUrl: `**/stock-gui/warehouse/table**${params.warehouseName}**`,
        rowFilter: [
          (row): boolean => !this.stockListPage.rowIsAssignedToStore({ row: row, storeName: params.storeName }),
        ],
      })
      .then(($row) => {
        if ($row === null) {
          return;
        }

        cy.wrap($row).find(this.stockListPage.getEditButtonSelector()).click();
        this.stockEditPage.assignAllAvailableStore();

        if (params.shouldTriggerPublishAndSync) {
          cy.runQueueWorker();
        }
      });
  };
}

interface ExecuteParams {
  warehouseName: string;
  storeName?: string;
  shouldTriggerPublishAndSync?: boolean;
}
