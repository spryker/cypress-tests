import {
  ActionEnum,
  ProductManagementAddPage,
  ProductManagementEditPage,
  ProductManagementEditVariantPage,
  ProductManagementListPage,
} from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class CreateProductScenario {
  @inject(ProductManagementAddPage) private productManagementAddPage: ProductManagementAddPage;
  @inject(ProductManagementEditPage) private productManagementEditPage: ProductManagementEditPage;
  @inject(ProductManagementListPage) private productManagementListPage: ProductManagementListPage;
  @inject(ProductManagementEditVariantPage) private productManagementEditVariantPage: ProductManagementEditVariantPage;

  execute = (params?: ExecuteParams): ProductAbstract => {
    this.productManagementAddPage.visit();
    const productAbstract = this.productManagementAddPage.create();
    this.productManagementEditPage.approve();

    this.productManagementListPage.visit();
    this.productManagementListPage.update({ query: productAbstract.sku, action: ActionEnum.edit });
    this.productManagementEditPage.openFirstVariant();

    this.productManagementEditVariantPage.activate();

    if (params?.shouldTriggerPublishAndSync) {
      cy.runCliCommands(['vendor/bin/console queue:worker:start --stop-when-empty']);
    }

    return productAbstract;
  };
}

interface ExecuteParams {
  shouldTriggerPublishAndSync?: boolean;
}

interface ProductAbstract {
  sku: string;
  name: string;
  description: string;
  price: string;
}
