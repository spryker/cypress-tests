import {
  ActionEnum,
  ProductManagementEditPage,
  ProductManagementEditVariantPage,
  ProductManagementListPage,
} from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class UpdatePriceProductScenario {
  @inject(ProductManagementListPage) private productManagementListPage: ProductManagementListPage;
  @inject(ProductManagementEditPage) private productManagementEditPage: ProductManagementEditPage;
  @inject(ProductManagementEditVariantPage) private productManagementEditVariantPage: ProductManagementEditVariantPage;

  execute = (params: ExecuteParams): void => {
    this.productManagementListPage.visit();
    this.productManagementListPage.update({ query: params.abstractSku, action: ActionEnum.edit });
    this.productManagementEditPage.openFirstVariant();

    this.productManagementEditVariantPage.updatePrice(params.newPrice);

    if (params?.shouldTriggerPublishAndSync) {
      cy.runQueueWorker();
    }
  };
}

interface ExecuteParams {
  abstractSku: string;
  newPrice: string;
  shouldTriggerPublishAndSync?: boolean;
}
