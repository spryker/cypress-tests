import { injectable } from 'inversify';

import { CheckoutPaymentRepository } from '../checkout-payment-repository';

@injectable()
export class SuiteCheckoutPaymentRepository implements CheckoutPaymentRepository {
  getDummyPaymentInvoiceRadio = (): Cypress.Chainable => cy.get('#paymentForm_paymentSelection_dummyPaymentInvoice');
  getDummyPaymentInvoiceDateField = (): Cypress.Chainable => cy.get('#paymentForm_dummyPaymentInvoice_date_of_birth');
  getGoToSummaryButton = (): Cypress.Chainable => cy.get('[data-qa="submit-button"]');
  getDummyMarketplacePaymentInvoiceRadio = (): Cypress.Chainable =>
    cy.get('#paymentForm_paymentSelection_dummyMarketplacePaymentInvoice');
  getDummyMarketplacePaymentInvoiceDateField = (): Cypress.Chainable =>
    cy.get('#paymentForm_dummyMarketplacePaymentInvoice_dateOfBirth');
  getDummyPaymentCreditCardRadio = (): Cypress.Chainable =>
    cy.get('#paymentForm_paymentSelection_dummyPaymentCreditCard');
  getDummyPaymentCreditCardNumberInput = (): Cypress.Chainable =>
    cy.get('#paymentForm_dummyPaymentCreditCard_card_number');
  getDummyPaymentCreditCardNameInput = (): Cypress.Chainable =>
    cy.get('#paymentForm_dummyPaymentCreditCard_name_on_card');
  getDummyPaymentCreditCardSecurityCodeNumberInput = (): Cypress.Chainable =>
    cy.get('#paymentForm_dummyPaymentCreditCard_card_security_code');
}
