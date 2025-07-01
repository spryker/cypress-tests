import { autoWired } from '@utils';
import { injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class ProductMeasurementUnitCreatePage extends BackofficePage {
  protected PAGE_URL = '/product-measurement-unit-gui/index/create';

  assertCreateUrl = (): void => {
    cy.url().should('include', this.PAGE_URL);
  }

  interceptCreateFormSubmit = (alias: string): void => {
    cy.intercept('POST', this.PAGE_URL + '*').as(alias);
  }

  fillCreateForm = (code:string, name:string, defaultPrecision: string): void => {
    cy.get('input[name="product_measurement_unit_form[code]"]').clear();
    cy.get('input[name="product_measurement_unit_form[code]"]').type(code);
    cy.get('input[name="product_measurement_unit_form[name]"]').clear();
    cy.get('input[name="product_measurement_unit_form[name]"]').type(name);
    cy.get('input[name="product_measurement_unit_form[default_precision]"]').clear();
    cy.get('input[name="product_measurement_unit_form[default_precision]"]').type(defaultPrecision);
  }

  submitCreateForm = (): void => {
    cy.get('form').get('button[type="submit"]').click();
  }

  getCodeInputField = (): Cypress.Chainable => {
    return cy.get('form').get('input[name="product_measurement_unit_form[code]"]');
  }

  getNameInputField = (): Cypress.Chainable => {
    return cy.get('form').get('input[name="product_measurement_unit_form[name]"]');
  }

  getDefaultPrecisionInputField = (): Cypress.Chainable => {
    return cy.get('form').get('input[name="product_measurement_unit_form[default_precision]"]');
  }
}
