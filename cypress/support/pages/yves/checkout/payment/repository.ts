export interface Repository {
  getDummyPaymentInvoiceRadio(): Cypress.Chainable;

  getDummyPaymentInvoiceDateField(): Cypress.Chainable;

  getGoToSummaryButton(): Cypress.Chainable;
}
