import { ActionEnum, ProductManagementEditPage, ProductManagementListPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class EnableProductForAllStoresScenario {
  @inject(ProductManagementEditPage) private productManagementEditPage: ProductManagementEditPage;
  @inject(ProductManagementListPage) private productManagementListPage: ProductManagementListPage;

  execute = (params: ExecuteParams): void => {
    this.productManagementListPage.visit();
    this.productManagementListPage.update({ query: params.abstractProductSku, action: ActionEnum.edit });

    this.productManagementEditPage.assignAllPossibleStores();
    this.productManagementEditPage.bulkPriceUpdate(params.productPrice);
    this.productManagementEditPage.save();

    if (params?.shouldTriggerPublishAndSync) {
      cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
    }
  };
}

interface ExecuteParams {
  abstractProductSku: string;
  productPrice: string;
  shouldTriggerPublishAndSync?: boolean;
}
