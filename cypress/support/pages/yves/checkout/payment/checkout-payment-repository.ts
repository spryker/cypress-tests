export interface CheckoutPaymentRepository {
  getDummyPaymentInvoiceRadio(): Cypress.Chainable;
  getDummyPaymentInvoiceDateFieldSelector(): string;
  getDummyPaymentInvoiceDateField(): Cypress.Chainable;
  getGoToSummaryButton(): Cypress.Chainable;
  getDummyMarketplacePaymentInvoiceRadio(): Cypress.Chainable;
  getDummyMarketplacePaymentInvoiceDateFieldSelector(): string;
  getDummyMarketplacePaymentInvoiceDateField(): Cypress.Chainable;
  getDummyPaymentCreditCardRadio(): Cypress.Chainable;
  getDummyPaymentCreditCardNumberInput(): Cypress.Chainable;
  getDummyPaymentCreditCardNameInput(): Cypress.Chainable;
  getDummyPaymentCreditCardSecurityCodeNumberInput(): Cypress.Chainable;
}
