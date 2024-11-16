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
export class DeactivateProductScenario {
  @inject(ProductManagementListPage) private productManagementListPage: ProductManagementListPage;
  @inject(ProductManagementEditPage) private productManagementEditPage: ProductManagementEditPage;
  @inject(ProductManagementEditVariantPage) private productManagementEditVariantPage: ProductManagementEditVariantPage;

  execute = (params: ExecuteParams): void => {
    this.productManagementListPage.visit();
    this.productManagementListPage.update({ query: params.abstractSku, action: ActionEnum.edit });
    this.productManagementEditPage.openFirstVariant();

    this.productManagementEditVariantPage.deactivate();

    if (params?.shouldTriggerPublishAndSync) {
      cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
    }
  };
}

interface ExecuteParams {
  abstractSku: string;
  shouldTriggerPublishAndSync?: boolean;
}
