import { Repository } from '../repository';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class SuiteRepository implements Repository {
  getGuestRadioButton = (): Cypress.Chainable => {
    return cy.get(
      '[data-qa="component toggler-radio checkoutProceedAs guest"]'
    );
  };

  getGuestFirstNameField = (): Cypress.Chainable => {
    return cy.get('#guestForm_customer_first_name');
  };

  getGuestLastNameField = (): Cypress.Chainable => {
    return cy.get('#guestForm_customer_last_name');
  };

  getGuestEmailField = (): Cypress.Chainable => {
    return cy.get('#guestForm_customer_email');
  };

  getGuestTermsCheckbox = (): Cypress.Chainable => {
    return cy.get(
      '[data-qa="component checkbox guestForm[customer][accept_terms] guestForm_customer_accept_terms"]'
    );
  };

  getGuestSubmitButton = (): Cypress.Chainable => {
    return cy.contains('button', 'Submit');
  };
}
