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

        this.stockListPage.interceptTable({url: '/stock-gui/warehouse/table**'});

        this.stockListPage.getEditButton({
            searchQuery: params.warehouse,
            tableUrl: '/stock-gui/warehouse/table**',
            rowFilter: [
                (row) => this.stockListPage.rowIsAssignedToStore({ row, storeName: params.storeName })
            ]
        }).then((editButton) => {
            if (editButton === null) {
                return;
            }

            cy.wrap(editButton).should('be.visible').click();

            this.stockEditPage.assignAllAvailableStore();

            if (params?.shouldTriggerPublishAndSync) {
                cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
            }
        });
    };
}

interface ExecuteParams {
    warehouse: string;
    storeName?: string;
    shouldTriggerPublishAndSync?: boolean;
}
