import { StockEditPage, StockListPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class EnableWarehouseForAllStoresScenario {
  @inject(StockEditPage) private stockEditPage: StockEditPage;
  @inject(StockListPage) private stockListPage: StockListPage;

  execute = (params: ExecuteParams): void => {
    this.stockListPage.visit();
    this.stockListPage
      .find({
        searchQuery: params.warehouseName,
        tableUrl: '/stock-gui/warehouse/table**',
      })
      .then(($row) => {
        const isStoreAssigned = this.stockListPage.rowIsAssignedToStore({ row: $row, storeName: params.storeName });
        if (!isStoreAssigned) {
          cy.wrap($row).find('a:contains("Edit")').click();

          this.stockEditPage.assignAllAvailableStore();

          if (params.shouldTriggerPublishAndSync) {
            cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
          }
        }
      });
  };
}

interface ExecuteParams {
  warehouseName: string;
  storeName?: string;
  shouldTriggerPublishAndSync?: boolean;
}
