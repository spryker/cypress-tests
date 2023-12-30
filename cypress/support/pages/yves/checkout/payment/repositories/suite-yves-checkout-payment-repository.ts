import { injectable } from 'inversify';
import 'reflect-metadata';
import { YvesCheckoutPaymentRepository } from '../yves-checkout-payment-repository';

@injectable()
export class SuiteYvesCheckoutPaymentRepository
  implements YvesCheckoutPaymentRepository
{
  getDummyPaymentInvoiceRadio = (): Cypress.Chainable => {
    return cy.get('#paymentForm_paymentSelection_dummyPaymentInvoice');
  };

  getDummyPaymentInvoiceDateField = (): Cypress.Chainable => {
    return cy.get('#paymentForm_dummyPaymentInvoice_date_of_birth');
  };

  getGoToSummaryButton = (): Cypress.Chainable => {
    return cy.contains('button', 'Go to Summary');
  };
}
