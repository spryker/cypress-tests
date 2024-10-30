import { ActionEnum, StockEditPage, StockListPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class EnableWarehouseForAllStoresScenario {
  @inject(StockEditPage) private stockEditPage: StockEditPage;
  @inject(StockListPage) private stockListPage: StockListPage;

  execute = (params: ExecuteParams): void => {
    this.stockListPage.visit();
    this.stockListPage.find({ query: params.warehouse, expectedCount: 1 }).then(($row) => {
      if (!this.stockListPage.rowIsAssignedToStore({ row: $row, storeName: params.storeName })) {
        this.stockListPage.update({ query: params.warehouse, action: ActionEnum.edit });
        this.stockEditPage.assignAllAvailableStore();

        if (params?.shouldTriggerPublishAndSync) {
          cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
        }
      }
    });
  };
}

interface ExecuteParams {
  warehouse: string;
  storeName?: string;
  shouldTriggerPublishAndSync?: boolean;
}
