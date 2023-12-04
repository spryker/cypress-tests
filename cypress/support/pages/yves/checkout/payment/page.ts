import { AbstractPage } from '../../../abstract-page';
import { Repository } from './repository';

export class Page extends AbstractPage {
  PAGE_URL = '/checkout/payment';
  repository: Repository;

  constructor() {
    super();
    this.repository = new Repository();
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
