import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class StoreCreateRepository {
  getNameInput = (): Cypress.Chainable => cy.get('#store_name');
  getLocalesTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-locale_store_relation"]');
  getDefaultLocaleSelect = (): Cypress.Chainable => cy.get('#select2-store_defaultLocaleIsoCode-container');
  getDefaultLocaleSearchInput = (): Cypress.Chainable =>
    cy.get('[aria-controls="select2-store_defaultLocaleIsoCode-results"]');
  getCurrenciesTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-locale_currency_relation"]');
  getDefaultCurrencySelect = (): Cypress.Chainable => cy.get('#select2-store_defaultCurrencyIsoCode-container');
  getDefaultCurrencySearchInput = (): Cypress.Chainable =>
    cy.get('[aria-controls="select2-store_defaultCurrencyIsoCode-results"]');
  getLocaleSearchInput = (): Cypress.Chainable => cy.get('#available-locale-table_filter').find('input');
  getCurrencySearchInput = (): Cypress.Chainable => cy.get('#available-currency-table_filter').find('input');
  getAvailableEnUsLocaleInput = (): Cypress.Chainable => cy.get('#available-locale-table [value="en_US"]');
  getAvailableEuroCurrencyInput = (): Cypress.Chainable => cy.get('#available-currency-table [value="EUR"]');
  getSaveButton = (): Cypress.Chainable => cy.get('[type="submit"]');
}
