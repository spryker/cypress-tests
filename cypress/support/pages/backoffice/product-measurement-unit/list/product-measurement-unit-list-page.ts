import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import {
  ProductMeasurementUnitListRepository,
} from './product-measurement-unit-list-repository';

@injectable()
@autoWired
export class ProductMeasurementUnitListPage extends BackofficePage {
  @inject(ProductMeasurementUnitListRepository) private repository: ProductMeasurementUnitListRepository;

  protected PAGE_URL = '/product-measurement-unit-gui';
  protected POST_URL = '/product-measurement-unit-gui/index/table';

  clearSearchField = (): void => {
    cy.get('input[placeholder*="Search"]').clear();
  }

  typeSearchField = (searchQuery: string): void => {
    cy.get('input[placeholder*="Search"]').type(searchQuery);
  }

  getPageTitle = ():  Cypress.Chainable => {
    return cy.get('h2').contains('Measurement Unit');
  }

  getCreateButton = (): Cypress.Chainable => {
    return cy.get('a').contains(/Create/i);
  }

  getTableRows = (): Cypress.Chainable => {
    return cy.get('table.dataTable tbody tr');
  }

  getTableEditButton = (row: number): Cypress.Chainable => {
    return this.getTableRows().eq(row).get('a').contains(/edit/i);
  }

  getTableDeleteButton = (row: number): Cypress.Chainable => {
    return this.getTableRows().eq(row).get('button').contains(/delete/i);
  }

  getPaginationBar = (): Cypress.Chainable => {
    return cy.get('.dataTables_paginate');
  }

  // TBD
  getTableCodeColumn = (): Cypress.Chainable => {
    return cy.get('table.dataTable thead');
  }

  interceptFetchTable = (alias: string): void => {
    cy.intercept('GET', this.POST_URL + '*').as(alias);
  }
}
