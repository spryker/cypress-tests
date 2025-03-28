import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { SspServiceRepository } from './ssp-service-repository';
import Chainable = Cypress.Chainable;

@injectable()
@autoWired
export class SspServiceListPage extends YvesPage {
  @inject(REPOSITORIES.SspServiceRepository) private repository: SspServiceRepository;

  protected PAGE_URL = '/customer/ssp-service';

  getTable(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getSspServiceTable();
  }

  getTableRows(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getSspServiceTableRows();
  }

  getTableHeaders(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getSspServiceTableHeaders();
  }

  clickSortColumn(columnName: string): void {
    this.repository.getSortColumnByName(columnName).click();
  }

  getOrderByInput(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getSortOrderByInput();
  }

  getOrderDirectionInput(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getSortDirectionInput();
  }

  clickResetButton(): void {
    this.repository.getResetButton().click();
  }

  clickPaginationLink(pageNumber: number): void {
    this.repository.getPagination().find('a').contains(pageNumber.toString()).click();
  }

  getFirstRowReference(): string {
    return this.repository.getFirstRowReference();
  }

  viewFirstServiceDetails(): void {
    this.repository.getFirstRowViewDetailsButton().click();
  }

  // Methods required for tests
  assertPageTitleIsVisible(): void {
    cy.contains('h1', 'Services').should('be.visible');
  }

  assertTableHeadersExist(headers: string[]): void {
    headers.forEach((header) => {
      this.getTableHeaders().contains(header).should('exist');
    });
  }

  // Search methods
  setSearchType(type: string): void {
    this.repository.getSearchTypeSelect().select(type);
  }

  setSearchText(text: string): void {
    this.repository.getSearchTextInput().clear().type(text);
  }

  getBusinessUnitSelect(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getBusinessUnitSelect();
  }

  clickSearchButton(): void {
    this.repository.getSearchButton().click();
  }

  searchFor(searchType: string, searchText: string): void {
    this.setSearchType(searchType);
    this.setSearchText(searchText);
    this.clickSearchButton();
  }

  sortByColumn(columnName: string): void {
    this.clickSortColumn(columnName);
  }

  assertSortDirectionIs(direction: 'ASC' | 'DESC'): void {
    this.getOrderDirectionInput().should('have.value', direction);
  }

  resetSearchFilters(): void {
    this.clickResetButton();
  }

  assertNoSortIsApplied(): void {
    this.getOrderByInput().should('have.value', '');
    this.getOrderDirectionInput().should('have.value', '');
  }

  assertPaginationExists(): void {
    this.repository.getPagination().should('exist');
  }

  goToNextPageIfExists(): void {
    this.repository
      .getPagination()
      .find('a')
      .contains('Next')
      .then(($next) => {
        if ($next.length > 0) {
          cy.wrap($next).click();
        }
      });
  }

  assertCurrentPageNumberIfMultiplePages(pageNumber: number): void {
    this.repository
      .getPagination()
      .find('li.active')
      .then(($active) => {
        if ($active.length > 0) {
          cy.wrap($active).should('contain', pageNumber.toString());
        }
      });
  }

  assertServiceListExists(): void {
    this.getTable().should('exist');
    this.getTableHeaders().should('have.length.at.least', 5);
  }

  assertColumnExists(columnName: string): void {
    cy.contains('th', columnName).should('exist');
  }

  assertOrderBy(fieldName: string): void {
    this.getOrderByInput().should('have.value', fieldName);
  }

  assertOrderDirection(direction: string): void {
    this.getOrderDirectionInput().should('have.value', direction);
  }

  assertPaginationActive(pageNumber: number): void {
    this.repository.getPagination().find('li.active').should('contain', pageNumber);
  }
}
