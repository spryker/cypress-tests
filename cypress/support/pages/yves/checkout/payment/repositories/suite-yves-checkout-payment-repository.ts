import { injectable } from 'inversify';
import 'reflect-metadata';
import { YvesCheckoutPaymentRepository } from '../yves-checkout-payment-repository';

@injectable()
export class SuiteYvesCheckoutPaymentRepository implements YvesCheckoutPaymentRepository {
  getDummyPaymentInvoiceRadio = (): Cypress.Chainable => cy.get('#paymentForm_paymentSelection_dummyPaymentInvoice');
  getDummyPaymentInvoiceDateField = (): Cypress.Chainable => cy.get('#paymentForm_dummyPaymentInvoice_date_of_birth');
  getGoToSummaryButton = (): Cypress.Chainable => cy.contains('button', 'Go to Summary');
  getDummyMarketplacePaymentInvoiceRadio = (): Cypress.Chainable =>
    cy.get('#paymentForm_paymentSelection_dummyMarketplacePaymentInvoice');
  getDummyMarketplacePaymentInvoiceDateField = (): Cypress.Chainable =>
    cy.get('#paymentForm_dummyMarketplacePaymentInvoice_dateOfBirth');
}
