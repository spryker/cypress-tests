import { ActionEnum, MerchantUpdatePage, MerchantListPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class EnableMerchantForAllStoresScenario {
  @inject(MerchantUpdatePage) private merchantUpdatePage: MerchantUpdatePage;
  @inject(MerchantListPage) private merchantListPage: MerchantListPage;

  execute = (params: ExecuteParams): void => {
    this.merchantListPage.visit();
    this.merchantListPage.update({ query: params.merchantName, action: ActionEnum.edit });
    this.merchantUpdatePage.assignAllAvailableStore();

    cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
  };
}

interface ExecuteParams {
  merchantName: string;
  shouldTriggerPublishAndSync?: boolean;
}
