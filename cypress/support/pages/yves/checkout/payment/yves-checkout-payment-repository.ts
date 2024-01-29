export interface YvesCheckoutPaymentRepository {
  getDummyPaymentInvoiceRadio(): Cypress.Chainable;

  getDummyPaymentInvoiceDateField(): Cypress.Chainable;

  getGoToSummaryButton(): Cypress.Chainable;

  getDummyMarketplacePaymentInvoiceRadio(): Cypress.Chainable;

  getDummyMarketplacePaymentInvoiceDateField(): Cypress.Chainable;
}
