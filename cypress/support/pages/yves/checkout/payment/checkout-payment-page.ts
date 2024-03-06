import { TYPES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { YvesPage } from '../../yves-page';
import { CheckoutPaymentRepository } from './checkout-payment-repository';

@injectable()
@autoWired
export class CheckoutPaymentPage extends YvesPage {
  protected PAGE_URL: string = '/checkout/payment';

  constructor(@inject(TYPES.CheckoutPaymentRepository) private repository: CheckoutPaymentRepository) {
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
