import { REPOSITORIES, autoWired, getPaymentMethodBasedOnEnv } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CheckoutPaymentRepository } from './checkout-payment-repository';

@injectable()
@autoWired
export class CheckoutPaymentPage extends YvesPage {
  @inject(REPOSITORIES.CheckoutPaymentRepository) private repository: CheckoutPaymentRepository;

  protected PAGE_URL = '/checkout/payment';

  // Mirrors the dispatch CheckoutScenario does internally, for specs that drive the checkout
  // steps themselves instead of going through the scenario.
  setPaymentMethod = (paymentMethod: string): void => {
    const paymentMethods: Record<string, () => void> = {
      dummyPaymentInvoice: () => this.setDummyPaymentMethod(),
      dummyPaymentCreditCard: () => this.setDummyPaymentCreditCardMethod(),
      dummyMarketplacePaymentInvoice: () => this.setDummyMarketplacePaymentMethod(),
    };

    paymentMethods[paymentMethod]();
  };

  // Marketplace repositories ship only the marketplace invoice method, the others only the dummy invoice one.
  setDefaultPaymentMethod = (): void => {
    if (getPaymentMethodBasedOnEnv() === 'dummyMarketplacePaymentInvoice') {
      this.setDummyMarketplacePaymentMethod();

      return;
    }

    this.setDummyPaymentMethod();
  };

  setDummyPaymentMethod = (): void => {
    this.repository.getDummyPaymentInvoiceRadio().click({ force: true });
    this.typeDateOfBirthWhenAsked(
      this.repository.getDummyPaymentInvoiceDateFieldSelector(),
      this.repository.getDummyPaymentInvoiceDateField
    );

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
    this.typeDateOfBirthWhenAsked(
      this.repository.getDummyMarketplacePaymentInvoiceDateFieldSelector(),
      this.repository.getDummyMarketplacePaymentInvoiceDateField
    );

    this.repository.getGoToSummaryButton().click();
  };

  // Whether the invoice asks for a date of birth is up to the shop's payment form, not the repository id:
  // b2b-demo-shop requires it while the b2b lane of b2b-demo-marketplace renders no such field.
  private typeDateOfBirthWhenAsked = (dateFieldSelector: string, getDateField: () => Cypress.Chainable): void => {
    this.getBody().then(($body: JQuery<HTMLElement>): void => {
      if ($body.find(`${dateFieldSelector}:visible`).length === 0) {
        return;
      }

      getDateField().clear();
      getDateField().type('12.12.1999');
    });
  };
}
