import { ActionEnum, ProductManagementListPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class DenyProductScenario {
  @inject(ProductManagementListPage) private productManagementListPage: ProductManagementListPage;

  execute = (params: ExecuteParams): void => {
    this.productManagementListPage.visit();
    this.productManagementListPage.update({ query: params.abstractSku, action: ActionEnum.deny });

    if (params?.shouldTriggerPublishAndSync) {
      cy.runCliCommands(['vendor/bin/console queue:worker:start --stop-when-empty']);
    }
  };
}

interface ExecuteParams {
  abstractSku: string;
  shouldTriggerPublishAndSync?: boolean;
}
