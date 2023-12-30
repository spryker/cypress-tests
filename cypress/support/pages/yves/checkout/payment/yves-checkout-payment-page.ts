import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../utils/inversify/types';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import { YvesCheckoutPaymentRepository } from './yves-checkout-payment-repository';

@injectable()
@autoProvide
export class YvesCheckoutPaymentPage extends AbstractPage {
  public PAGE_URL: string = '/checkout/payment';

  constructor(
    @inject(TYPES.CheckoutPaymentRepository)
    private repository: YvesCheckoutPaymentRepository
  ) {
    super();
  }

  setDummyPaymentMethod = (): void => {
    this.repository.getDummyPaymentInvoiceRadio().click({ force: true });
    this.repository
      .getDummyPaymentInvoiceDateField()
      .clear()
      .type('12.12.1999');

    this.repository.getGoToSummaryButton().click();
  };
}
