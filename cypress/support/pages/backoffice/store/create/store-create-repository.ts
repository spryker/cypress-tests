import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class StoreCreateRepository {
  getNameInput = (): Cypress.Chainable => cy.get('#store_name');
  getLocalesTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-locale_store_relation"]');
  getDefaultLocaleSelect = (): Cypress.Chainable => cy.get('[name="store[defaultLocaleIsoCode]"]');
  getCurrenciesTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-locale_currency_relation"]');
  getDefaultCurrencySelect = (): Cypress.Chainable => cy.get('[name="store[defaultCurrencyIsoCode]"]');
  getLocaleSearchInput = (): Cypress.Chainable => cy.get('#available-locale-table_filter').find('input');
  getCurrencySearchInput = (): Cypress.Chainable => cy.get('#available-currency-table_filter').find('input');
  getAvailableLocaleInput = (locale: string): Cypress.Chainable =>
    cy.get(`#available-locale-table_wrapper [value="${locale}"]`);
  getAvailableCurrencyInput = (currency: string): Cypress.Chainable =>
    cy.get(`#available-currency-table [value="${currency}"]`);
  getDisplayRegionsTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-country_store_relation"]');
  getCountrySearchInput = (): Cypress.Chainable => cy.get('#available-country-table_filter').find('input');
  getAvailableCountryInput = (country: string): Cypress.Chainable =>
    cy.get(`#available-country-table [value="${country}"]`);
  getSaveButton = (): Cypress.Chainable => cy.get('[type="submit"]');
  getStoreContextTabButton = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-store_context"]');
  getAddStoreContextButton = (): Cypress.Chainable => cy.get('#tab-content-store_context .btn.add-store-context');
  getTimezoneSelector = (): Cypress.Chainable =>
    cy.get('#store_applicationContextCollection_applicationContexts_1_timezone');
}
