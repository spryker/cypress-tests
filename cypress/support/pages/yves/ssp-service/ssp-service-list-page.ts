import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { SspServiceRepository } from './ssp-service-repository';
import Chainable = Cypress.Chainable;

@injectable()
@autoWired
export class SspServiceListPage extends YvesPage {
  @inject(REPOSITORIES.SspServiceRepository) private repository: SspServiceRepository;

  protected PAGE_URL = '/customer/ssp-service/list';

  getTable(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getSspServiceTable();
  }

  getTableRows(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getSspServiceTableRows();
  }

  getTableHeaders(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getSspServiceTableHeaders();
  }

  getPageTitle(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getSspServicePageTitle();
  }

  getOrderByInput(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getSortOrderByInput();
  }

  getOrderDirectionInput(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getSortDirectionInput();
  }

  getFirstRowReference(): string {
    return this.repository.getFirstRowReference();
  }

  getBusinessUnitSelect(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getBusinessUnitSelect();
  }

  getDetailsPageRescheduleButton(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getDetailsPageRescheduleButton();
  }

  getRescheduleFormDateInput(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getRescheduleFormDateInput();
  }

  getRescheduleFormTimeInput(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getRescheduleFormTimeInput();
  }

  getRescheduleFormSubmitButton(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getRescheduleFormSubmitButton();
  }

  getServiceCancelButton(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getServiceCancelButton();
  }

  clickSortColumn(columnName: string): void {
    this.repository.getSortColumnByName(columnName).click();
  }

  clickResetButton(): void {
    this.repository.getResetButton().click();
  }

  clickPaginationLink(pageNumber: number): void {
    this.repository.getPagination().find('a').contains(pageNumber.toString()).click();
  }

  viewFirstServiceDetails(): void {
    this.repository.getFirstRowViewDetailsButton().click();
  }

  setSearchType(type: string): void {
    this.repository.getSearchTypeSelect().select(type, { force: true });
  }

  setSearchText(text: string): void {
    this.repository.getSearchTextInput().clear().type(text, { force: true });
  }

  clickSearchButton(): void {
    this.repository.getSearchButton().click();
  }

  searchFor(searchType: string, searchText: string): void {
    this.setSearchType(searchType);
    this.setSearchText(searchText);
    this.clickSearchButton();
  }

  rescheduleService(newDate: string, newTime: string): void {
    this.getDetailsPageRescheduleButton().click();
    this.getRescheduleFormDateInput().clear().type(newDate);
    this.getRescheduleFormTimeInput().clear().type(newTime);
    this.getRescheduleFormSubmitButton().click();
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

  updateServiceDateToTomorrow(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0);
    const dateTimeISO = tomorrow.toISOString().split('.')[0].substring(0, 16);

    this.getRescheduleFormDateInput().clear().type(dateTimeISO);
    this.getRescheduleFormSubmitButton().click();

    return tomorrow;
  }

  rescheduleFirstServiceToTomorrow(): void {
    this.viewFirstServiceDetails();
    this.assertOrderDetailsPageUrl();

    this.getDetailsPageRescheduleButton().should('be.visible').first().click();
    this.assertUpdateServiceTimePageUrl();

    const tomorrow = this.updateServiceDateToTomorrow();

    this.assertServiceListPageUrl();
    this.assertServiceRescheduled(tomorrow);
  }

  cancelFirstService(): void {
    this.viewFirstServiceDetails();
    this.getServiceCancelButton().should('be.visible').first().click();

    this.assertServiceListPageUrl();
  }

  openFilter(): void {
    this.repository.getFiltersTriggerSelector().click();
  }

  assertTableHeadersExist(headers: string[]): void {
    headers.forEach((header) => {
      this.getTableHeaders().contains(header).should('exist');
    });
  }

  assertBusinessUnitSelectIsVisible(): void {
    this.getBusinessUnitSelect().should('exist');
    this.getBusinessUnitSelect().find('option[value*="company"]').should('exist');
  }

  assertSortDirectionIs(direction: 'ASC' | 'DESC'): void {
    this.getOrderDirectionInput().should('have.value', direction);
  }

  assertNoSortIsApplied(): void {
    this.getOrderByInput().should('have.value', '');
    this.getOrderDirectionInput().should('have.value', '');
  }

  assertPaginationExists(): void {
    this.repository.getPagination().should('exist');
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

  assertServiceTableHasRows(count: number): void {
    this.getTableRows().should('have.length', count);
  }

  assertServiceTableHasAtLeastRows(count: number): void {
    this.getTableRows().should('have.length.at.least', count);
  }

  assertSorting(columnName: string, orderByValue: string): void {
    this.clickSortColumn(columnName);
    this.getOrderByInput().should('have.value', orderByValue);
    this.getOrderDirectionInput().should('have.value', 'ASC');

    this.clickSortColumn(columnName);
    this.getOrderByInput().should('have.value', orderByValue);
    this.getOrderDirectionInput().should('have.value', 'DESC');
  }

  assertSearchResult(searchQuery: string, expectedResultsCount: number): void {
    this.getTableRows().should('be.visible');
    cy.url().should('include', searchQuery);
    this.getTableRows().should('have.length', expectedResultsCount);
  }

  assertPaginationActive(pageNumber: number): void {
    this.repository.getPagination().find('li.active').should('contain', pageNumber);
  }

  assertServiceRescheduled(tomorrow: Date): void {
    this.getTableRows()
      .first()
      .find('td')
      .eq(2)
      .invoke('text')
      .then((text) => {
        const updatedDate = text.trim();
        const day = tomorrow.getDate();
        const year = tomorrow.getFullYear();

        expect(updatedDate).to.include(`${day}, ${year}`);
      });
  }

  assertServiceCancelled(): void {
    this.viewFirstServiceDetails();
    this.getServiceCancelButton().first().should('have.length', 1);
  }

  assertFirstServiceIsCancelled(): void {
    this.assertServiceCancelled();
    this.visit();
    this.viewFirstServiceDetails();
    this.assertOrderDetailsPageUrl();
    this.getServiceCancelButton().should('have.length', 1);
  }

  assertServiceListPage(): void {
    const expectedHeaders = ['Order Reference', 'Service Name', 'Time and Date', 'Created At', 'State'];

    this.getPageTitle().should('contain', 'Services');
    this.getTable().should('exist');
    this.getTableHeaders().should('have.length.at.least', 5);
    this.assertTableHeadersExist(expectedHeaders);
  }

  assertServiceListPageUrl(): void {
    cy.url().should('include', '/customer/ssp-service/list');
  }

  assertOrderDetailsPageUrl(): void {
    cy.url().should('include', '/order/details');
  }

  assertUpdateServiceTimePageUrl(): void {
    cy.url().should('include', '/update-service-time');
  }
}
