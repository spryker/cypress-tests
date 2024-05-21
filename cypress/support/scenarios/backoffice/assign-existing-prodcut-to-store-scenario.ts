import {
  ActionEnum,
  ProductManagementEditPage,
  ProductManagementListPage,
  StockEditPage,
  StockListPage,
} from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class AssignExistingProductToStoreScenario {
  @inject(StockEditPage) private stockEditPage: StockEditPage;
  @inject(StockListPage) private stockListPage: StockListPage;
  @inject(ProductManagementEditPage) private productManagementEditPage: ProductManagementEditPage;
  @inject(ProductManagementListPage) private productManagementListPage: ProductManagementListPage;

  execute = (params: ExecuteParams): void => {
    this.stockListPage.visit();
    this.stockListPage.update({ query: params.warehouse, action: ActionEnum.edit });
    this.stockEditPage.assignAllAvailableStore();

    this.productManagementListPage.visit();
    this.productManagementListPage.update({ query: params.abstractProductSku, action: ActionEnum.edit });

    this.productManagementEditPage.checkAllStores();
    this.productManagementEditPage.setPriceForAllStores(params.productPrice);
    this.productManagementEditPage.save();

    if (params?.shouldTriggerPublishAndSync) {
      cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
    }
  };
}

interface ExecuteParams {
  abstractProductSku: string;
  warehouse: string;
  productPrice: string;
  shouldTriggerPublishAndSync?: boolean;
}
