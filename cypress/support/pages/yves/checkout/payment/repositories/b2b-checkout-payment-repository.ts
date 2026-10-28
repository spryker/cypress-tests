import { injectable } from 'inversify';

import { CheckoutPaymentRepository } from '../checkout-payment-repository';

@injectable()
export class B2bCheckoutPaymentRepository implements CheckoutPaymentRepository {
  getDummyPaymentInvoiceRadio = (): Cypress.Chainable =>
    cy.get('#paymentForm_paymentSelection_dummyPaymentInvoice input');
  getDummyPaymentInvoiceDateFieldSelector = (): string => '#paymentForm_dummyPaymentInvoice_date_of_birth';
  getDummyPaymentInvoiceDateField = (): Cypress.Chainable => cy.get(this.getDummyPaymentInvoiceDateFieldSelector());
  getGoToSummaryButton = (): Cypress.Chainable => cy.get('[data-qa="submit-button"]');
  getDummyMarketplacePaymentInvoiceRadio = (): Cypress.Chainable =>
    cy.get('#paymentForm_paymentSelection_dummyMarketplacePaymentInvoice input');
  getDummyMarketplacePaymentInvoiceDateFieldSelector = (): string =>
    '#paymentForm_dummyMarketplacePaymentInvoice_dateOfBirth';
  getDummyMarketplacePaymentInvoiceDateField = (): Cypress.Chainable =>
    cy.get(this.getDummyMarketplacePaymentInvoiceDateFieldSelector());
  getDummyPaymentCreditCardRadio = (): Cypress.Chainable =>
    cy.get('#paymentForm_paymentSelection_dummyPaymentCreditCard input');
  getDummyPaymentCreditCardNumberInput = (): Cypress.Chainable =>
    cy.get('#paymentForm_dummyPaymentCreditCard_card_number');
  getDummyPaymentCreditCardNameInput = (): Cypress.Chainable =>
    cy.get('#paymentForm_dummyPaymentCreditCard_name_on_card');
  getDummyPaymentCreditCardSecurityCodeNumberInput = (): Cypress.Chainable =>
    cy.get('#paymentForm_dummyPaymentCreditCard_card_security_code');
}
