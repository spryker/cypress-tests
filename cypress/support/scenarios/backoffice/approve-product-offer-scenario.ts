import { ProductOfferListPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class ApproveProductOfferScenario {
  @inject(ProductOfferListPage) private readonly productOfferListPage: ProductOfferListPage;

  execute = (params: ExecuteParams): void => {
    this.productOfferListPage.visit();
    this.productOfferListPage.search(params.productOfferReference);
    this.productOfferListPage.clickApproveButton();

    if (params.shouldTriggerPublishAndSync) {
      cy.runQueueWorker();
    }
  };
}

interface ExecuteParams {
  productOfferReference: string;
  shouldTriggerPublishAndSync?: boolean;
}
