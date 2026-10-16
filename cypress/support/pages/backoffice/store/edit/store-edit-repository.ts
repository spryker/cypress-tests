import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class StoreEditRepository {
  getDefaultLocaleSelect = (): Cypress.Chainable => cy.get('[name="store[defaultLocaleIsoCode]"]');
  getDefaultCurrencySelect = (): Cypress.Chainable => cy.get('[name="store[defaultCurrencyIsoCode]"]');
  getVisibleToCustomerCheckbox = (): Cypress.Chainable => cy.get('[name="store[isVisibleToCustomer]"]');
}
