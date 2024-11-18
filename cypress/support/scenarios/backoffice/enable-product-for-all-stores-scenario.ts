import { ProductManagementEditPage, ProductManagementListPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class EnableProductForAllStoresScenario {
  @inject(ProductManagementEditPage) private productManagementEditPage: ProductManagementEditPage;
  @inject(ProductManagementListPage) private productManagementListPage: ProductManagementListPage;

  execute = (params: ExecuteParams): void => {
    this.productManagementListPage.visit();

      this.productManagementListPage.interceptTable({ url: '/product-management/index/table**' }, () => {
          this.productManagementListPage.find({
              searchQuery: params.abstractProductSku,
              tableUrl: '/product-management/index/table**',
              rowFilter: [
                  (row) => row.find('td[class*="column-sku"]').text().trim() === params.abstractProductSku
              ]
          }).then(($row) => {
              if (!this.productManagementListPage.rowIsAssignedToStore({row: $row, storeName: params.storeName})) {
                  this.productManagementListPage.clickEditAction($row);
                  this.productManagementEditPage.assignAllPossibleStores();
                  this.productManagementEditPage.bulkPriceUpdate(params.productPrice);
                  this.productManagementEditPage.save();

                  cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
              }
          })
      });
  };
}

interface ExecuteParams {
  abstractProductSku: string;
  productPrice: string;
  storeName?: string;
  shouldTriggerPublishAndSync?: boolean;
}
