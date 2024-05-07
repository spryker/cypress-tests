export interface CheckoutPaymentRepository {
  getDummyPaymentInvoiceRadio(): Cypress.Chainable;
  getDummyPaymentInvoiceDateField(): Cypress.Chainable;
  getGoToSummaryButton(): Cypress.Chainable;
  getDummyMarketplacePaymentInvoiceRadio(): Cypress.Chainable;
  getDummyMarketplacePaymentInvoiceDateField(): Cypress.Chainable;
  getDummyPaymentCreditCardRadio(): Cypress.Chainable;
  getDummyPaymentCreditCardNumberInput(): Cypress.Chainable;
  getDummyPaymentCreditCardNameInput(): Cypress.Chainable;
  getDummyPaymentCreditCardSecurityCodeNumberInput(): Cypress.Chainable;
}
