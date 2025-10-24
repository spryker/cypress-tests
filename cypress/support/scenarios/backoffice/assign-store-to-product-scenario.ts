import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ProductManagementEditPage, ProductManagementListPage } from '@pages/backoffice';

@injectable()
@autoWired
export class AssignStoreToProductScenario {
  @inject(ProductManagementEditPage) private productManagementEditPage: ProductManagementEditPage;
  @inject(ProductManagementListPage) private productManagementListPage: ProductManagementListPage;

  protected DEFAULT_BULK_PRODUCT_PRICE = '300';

  execute = (params: ExecuteParams): void => {
    this.productManagementListPage.visit();
    this.productManagementListPage
      .find({
        searchQuery: params.abstractProductSku,
        tableUrl: '/product-management/index/table**',
      })
      .then(($row) => {
        const isStoreAssigned = this.productManagementListPage.rowIsAssignedToStore({
          row: $row,
          storeName: params.storeName,
        });

        this.productManagementListPage.clickEditAction($row);
        this.productManagementEditPage.setDummyDEName(); // Gap in dynamic fixtures

        if (!isStoreAssigned) {
          this.productManagementEditPage.assignAllPossibleStores();
        }

        this.productManagementEditPage.bulkPriceUpdate(params.bulkProductPrice ?? this.DEFAULT_BULK_PRODUCT_PRICE);
        this.productManagementEditPage.save();

        if (params.shouldTriggerPublishAndSync) {
          cy.runCliCommands(['vendor/bin/console queue:worker:start --stop-when-empty']);
        }
      });
  };
}

interface ExecuteParams {
  abstractProductSku: string;
  storeName?: string;
  bulkProductPrice?: string;
  shouldTriggerPublishAndSync?: boolean;
}
