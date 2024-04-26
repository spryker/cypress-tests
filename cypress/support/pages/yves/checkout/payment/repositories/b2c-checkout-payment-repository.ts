import { injectable } from 'inversify';

import { CheckoutPaymentRepository } from '../checkout-payment-repository';

@injectable()
export class B2cCheckoutPaymentRepository implements CheckoutPaymentRepository {
  getDummyPaymentInvoiceRadio = (): Cypress.Chainable => cy.get('#paymentForm_paymentSelection_dummyPaymentInvoice');
  getDummyPaymentInvoiceDateField = (): Cypress.Chainable => cy.get('#paymentForm_dummyPaymentInvoice_date_of_birth');
  getGoToSummaryButton = (): Cypress.Chainable => cy.get('[data-qa="submit-button"]');
  getDummyMarketplacePaymentInvoiceRadio = (): Cypress.Chainable =>
    cy.get('#paymentForm_paymentSelection_dummyMarketplacePaymentInvoice');
  getDummyMarketplacePaymentInvoiceDateField = (): Cypress.Chainable =>
    cy.get('#paymentForm_dummyMarketplacePaymentInvoice_dateOfBirth');
}
