import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductMeasurementUnitCreateRepository } from './product-measurement-unit-create-repository';

@injectable()
@autoWired
export class ProductMeasurementUnitCreatePage extends BackofficePage {
  @inject(ProductMeasurementUnitCreateRepository) private repository: ProductMeasurementUnitCreateRepository;

  protected PAGE_URL = '/product-measurement-unit-gui/index/create';

  interceptCreateFormSubmit = (alias: string): void => {
    cy.intercept('POST', this.PAGE_URL + '*').as(alias);
  }

  fillCreateForm = (code:string, name:string, defaultPrecision: string): void => {
    cy.get(this.repository.getFormCodeFieldSelector()).clear();
    cy.get(this.repository.getFormCodeFieldSelector()).type(code);
    cy.get(this.repository.getFormNameFieldSelector()).clear();
    cy.get(this.repository.getFormNameFieldSelector()).type(name);
    cy.get(this.repository.getFormDefaultPrecisionFieldSelector()).clear();
    cy.get(this.repository.getFormDefaultPrecisionFieldSelector()).type(defaultPrecision);
  }

  submitCreateForm = (): void => {
    cy.get(this.repository.getFormSubmitSelector()).click();
  }
}
