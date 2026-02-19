import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductMeasurementUnitListRepository } from './product-measurement-unit-list-repository';

@injectable()
@autoWired
export class ProductMeasurementUnitListPage extends BackofficePage {
  @inject(ProductMeasurementUnitListRepository) private repository: ProductMeasurementUnitListRepository;

  protected PAGE_URL = '/product-measurement-unit-gui';
  protected POST_URL = '/product-measurement-unit-gui/index/table';

  findByText = (text: string): Cypress.Chainable => {
    return this.find({ interceptTableUrl: `**${this.POST_URL}**${text}**`, searchQuery: text });
  };

  getCreateButton = (): Cypress.Chainable => {
    return cy.get(this.repository.getCreateButtonSelector());
  };

  getTableRows = (): Cypress.Chainable => {
    return cy.get(this.repository.getTableRowsSelector());
  };

  getTableEditButton = (row: number): Cypress.Chainable => {
    return this.getTableRows().eq(row).get(this.repository.getEditButtonSelector());
  };

  getTableDeleteButton = (row: number): Cypress.Chainable => {
    return this.getTableRows().eq(row).get(this.repository.getDeleteButtonSelector());
  };

  getPaginationBar = (): Cypress.Chainable => {
    return cy.get(this.repository.getPaginationBarSelector());
  };

  getTableCodeColumn = (): Cypress.Chainable => {
    return cy.get(this.repository.getTableCodeColumnSelector());
  };
}
