import { injectable } from 'inversify';
import { TaxRateRepository } from '../tax-rate-repository';

@injectable()
export class SuiteTaxRateRepository implements TaxRateRepository {
  getForm(): Cypress.Chainable {
    return cy.get('form');
  }

  getNameInput(): Cypress.Chainable {
    return cy.get('#tax_rate_name');
  }

  getCountrySelect(): Cypress.Chainable {
    return cy.get('#tax_rate_fkCountry');
  }

  getPercentageInput(): Cypress.Chainable {
    return cy.get('#tax_rate_rate');
  }

  getSaveButton(): Cypress.Chainable {
    return cy.get('input.btn.btn-primary');
  }

  getListOfTaxRatesButton(): Cypress.Chainable {
    return cy.get('div[data-qa="title-action"] a');
  }

  getSuccessAlert(): Cypress.Chainable {
    return cy.get('div.alert-success');
  }

  getListSearchInput(): Cypress.Chainable {
    return cy.get('input.form-control.form-control-sm');
  }

  getSuccessMessagePattern(): RegExp {
    return /Tax rate [0-9]+ was created successfully\./;
  }

  getNameBlankError(): string {
    return 'This value should not be blank.';
  }

  getCountryBlankError(): string {
    return 'Select country.';
  }

  getPercentageRangeError(): string {
    return 'This value should be between 0 and 100.';
  }

  getAlreadyExistsError(): string {
    return 'Tax rate with provided name, percentage and country already exists.';
  }

  getEmptyTableMessage(): string {
    return 'No matching records found';
  }
}
