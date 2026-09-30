import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CustomerAddressCreateRepository {
  getSalutationSelect = (): Cypress.Chainable => cy.get('#customer_address_salutation');
  getFirstNameInput = (): Cypress.Chainable => cy.get('#customer_address_first_name');
  getLastNameInput = (): Cypress.Chainable => cy.get('#customer_address_last_name');
  getAddress1Input = (): Cypress.Chainable => cy.get('#customer_address_address1');
  getCityInput = (): Cypress.Chainable => cy.get('#customer_address_city');
  getZipCodeInput = (): Cypress.Chainable => cy.get('#customer_address_zip_code');
  getCountrySelect = (): Cypress.Chainable => cy.get('#customer_address_fk_country');
  getSubmitButton = (): Cypress.Chainable => cy.get('form[name="customer_address"]').find('[type="submit"]');
}
