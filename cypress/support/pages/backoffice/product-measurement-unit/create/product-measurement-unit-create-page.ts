import { autoWired } from '@utils';
import { injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class ProductMeasurementUnitCreatePage extends BackofficePage {
  protected PAGE_CREATE_URL = '/product-measurement-unit-gui/index/create';

  assertCreateUrl = (): void => {
    cy.url().should('include', this.PAGE_CREATE_URL);
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
