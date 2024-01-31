import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../utils/inversify/types';
import 'reflect-metadata';
import { YvesCheckoutPaymentRepository } from './yves-checkout-payment-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class YvesCheckoutPaymentPage extends AbstractPage {
  public PAGE_URL: string = '/checkout/payment';

  constructor(@inject(TYPES.YvesCheckoutPaymentRepository) private repository: YvesCheckoutPaymentRepository) {
    super();
  }

  public setDummyPaymentMethod = (): void => {
    this.repository.getDummyPaymentInvoiceRadio().click({ force: true });
    this.repository.getDummyPaymentInvoiceDateField().clear().type('12.12.1999');

    this.repository.getGoToSummaryButton().click();
  };

  public setDummyMarketplacePaymentMethod = (): void => {
    this.repository.getDummyMarketplacePaymentInvoiceRadio().click({ force: true });
    this.repository.getDummyMarketplacePaymentInvoiceDateField().clear().type('12.12.1999');

    this.repository.getGoToSummaryButton().click();
  };
}
