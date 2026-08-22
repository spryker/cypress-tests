import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CustomerEditRepository {
  getSalutationSelect = (): Cypress.Chainable => cy.get('#customer_salutation');
  getFirstNameInput = (): Cypress.Chainable => cy.get('#customer_first_name');
  getLastNameInput = (): Cypress.Chainable => cy.get('#customer_last_name');
  getSaveButton = (): Cypress.Chainable => cy.get('input.safe-submit');
}
