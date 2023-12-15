import { Repository } from '../repository';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class SuiteRepository implements Repository {
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
