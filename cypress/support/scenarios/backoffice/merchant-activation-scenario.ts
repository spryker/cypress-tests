import { ActionEnum, MerchantListPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantActivationScenario {
  @inject(MerchantListPage) private merchantListPage: MerchantListPage;

  execute = (params: ExecuteParams): void => {
    this.merchantListPage.visit();
    this.merchantListPage.update({ query: params.companyName, action: ActionEnum.activate });
  };
}

interface ExecuteParams {
  companyName: string;
}
