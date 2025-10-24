import { ActionEnum, ProductManagementListPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class ActivateProductScenario {
  @inject(ProductManagementListPage) private productManagementListPage: ProductManagementListPage;

  execute = (params: ExecuteParams): void => {
    this.productManagementListPage.visit();
    this.productManagementListPage.update({ query: params.abstractSku, action: ActionEnum.approve });

    if (params?.shouldTriggerPublishAndSync) {
      cy.runCliCommands(['vendor/bin/console queue:worker:start --stop-when-empty']);
    }
  };
}

interface ExecuteParams {
  abstractSku: string;
  shouldTriggerPublishAndSync?: boolean;
}
