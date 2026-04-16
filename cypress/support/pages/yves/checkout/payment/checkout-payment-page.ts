import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CheckoutPaymentRepository } from './checkout-payment-repository';

@injectable()
@autoWired
export class CheckoutPaymentPage extends YvesPage {
  @inject(REPOSITORIES.CheckoutPaymentRepository) private repository: CheckoutPaymentRepository;

  protected PAGE_URL = '/checkout/payment';

  setDummyPaymentMethod = (): void => {
    this.repository.getDummyPaymentInvoiceRadio().click({ force: true });
    this.repository.getDummyPaymentInvoiceDateField().clear().type('12.12.1999');

    this.repository.getGoToSummaryButton().click();
  };

  setDummyPaymentCreditCardMethod = (): void => {
    this.repository.getDummyPaymentCreditCardRadio().click({ force: true });
    this.repository.getDummyPaymentCreditCardNameInput().clear().type(this.faker.person.fullName());
    this.repository.getDummyPaymentCreditCardNumberInput().clear().type('4000000000001000');
    this.repository.getDummyPaymentCreditCardSecurityCodeNumberInput().clear().type('901');

    this.repository.getGoToSummaryButton().click();
  };

  setDummyMarketplacePaymentMethod = (): void => {
    this.repository.getDummyMarketplacePaymentInvoiceRadio().click({ force: true });
    this.repository.getDummyMarketplacePaymentInvoiceDateField().clear().type('12.12.1999');

    this.repository.getGoToSummaryButton().click();
  };
}
