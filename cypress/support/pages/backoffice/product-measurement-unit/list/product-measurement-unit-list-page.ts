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
  protected PAGE_CREATE_URL = '/product-measurement-unit-gui/index/create';
  protected POST_URL = '/product-measurement-unit-gui/index/table';

  getPageTitle = ():  Cypress.Chainable => {
    return cy.get('h2').contains('Measurement Unit');
  }

  getCreateButton = (): Cypress.Chainable => {
    return cy.get('a').contains(/Create/i);
  }

  getTableRows = (): Cypress.Chainable => {
    return cy.get('table.dataTable tbody tr');
  }

  getTableCell = (row: number, column: number) : Cypress.Chainable => {
    return this.getTableRows().eq(row).get('td').eq(column);
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

  getTableColumnValues = (columnNumber: number): Cypress.Chainable => {
    const values: string[] = [];

    return this.getTableRows().each($row => {
      values.push($row.find('td').eq(columnNumber).text().trim());
    }).then(() => values);
  }

  getPaginationBarPage = (pageNumber: number): Cypress.Chainable => {
    return this.getPaginationBar().contains('' + pageNumber);
  }

  getTableHeader = (columnNumber: number): Cypress.Chainable => {
    return cy.get('div.dataTables_scrollHead thead tr th').eq(columnNumber);
  }

  assertPaginationPageExists = (pageNumber: number): void => {
    this.getPaginationBar().get('a').contains('' + pageNumber).should('exist');
  }

  assertPaginationActivePage = (pageNumber: number): void => {
    this.getPaginationBar().get('.paginate_button.active').should('contain', '' + pageNumber)
  }

  clearSearchField = (): void => {
    cy.get('input[placeholder*="Search"]').clear();
  }

  typeSearchField = (searchQuery: string): void => {
    cy.get('input[placeholder*="Search"]').type(searchQuery);
  }

  assertTableContainsColumns = (): void => {
    cy.get('table.dataTable thead').should('contain', 'Code')
      .and('contain', 'Name')
      .and('contain', 'Default Precision');
  }

  interceptFetchTable = (alias: string): void => {
    cy.intercept('GET', this.POST_URL + '*').as(alias);
  }
}
