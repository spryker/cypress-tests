import { injectable } from 'inversify';
import 'reflect-metadata';
import { YvesCheckoutCustomerRepository } from '../yves-checkout-customer-repository';

@injectable()
export class SuiteYvesCheckoutCustomerRepository implements YvesCheckoutCustomerRepository {
  getGuestRadioButton = (): Cypress.Chainable => cy.get('[data-qa="component toggler-radio checkoutProceedAs guest"]');
  getGuestFirstNameField = (): Cypress.Chainable => cy.get('#guestForm_customer_first_name');
  getGuestLastNameField = (): Cypress.Chainable => cy.get('#guestForm_customer_last_name');
  getGuestEmailField = (): Cypress.Chainable => cy.get('#guestForm_customer_email');
  getGuestTermsCheckbox = (): Cypress.Chainable =>
    cy.get('[data-qa="component checkbox guestForm[customer][accept_terms] guestForm_customer_accept_terms"]');
  getGuestSubmitButton = (): Cypress.Chainable => cy.contains('button', 'Submit');
}
