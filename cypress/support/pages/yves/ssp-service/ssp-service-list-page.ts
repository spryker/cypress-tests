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

  // Reschedule methods
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

  rescheduleService(newDate: string, newTime: string): void {
    this.getDetailsPageRescheduleButton().click();
    this.getRescheduleFormDateInput().clear().type(newDate);
    this.getRescheduleFormTimeInput().clear().type(newTime);
    this.getRescheduleFormSubmitButton().click();
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

  /**
   * Sets up a date for tomorrow at 2:00 PM and enters it in the reschedule form
   * @returns The Date object for tomorrow at 2:00 PM
   */
  updateServiceDateToTomorrow(): Date {
    // Set up new date/time (tomorrow at 2:00 PM)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0);
    const dateTimeISO = tomorrow.toISOString().split('.')[0].substring(0, 16);

    // Complete the reschedule form
    this.getRescheduleFormDateInput().clear().type(dateTimeISO);
    this.getRescheduleFormSubmitButton().click();

    return tomorrow;
  }

  /**
   * Verifies that a service was rescheduled to the expected date
   * @param tomorrow The Date object representing the expected date
   */
  verifyServiceRescheduled(tomorrow: Date): void {
    this.getTableRows()
      .first()
      .find('td')
      .eq(2)
      .invoke('text')
      .then((text) => {
        const updatedDate = text.trim();
        const day = tomorrow.getDate();
        const year = tomorrow.getFullYear();

        // Verify date in formatted display matches expected date
        expect(updatedDate).to.include(`${day}, ${year}`);
      });
  }

  // Cancel service methods
  getServiceCancelButton(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getServiceCancelButton();
  }

  getStateCell(): Chainable<JQuery<HTMLElement>> {
    return this.repository.getStateCell();
  }

  /**
   * Cancels the first service in the list
   */
  cancelService(): void {
    // Go to service details page
    this.viewFirstServiceDetails();
    cy.url().should('include', '/order/details');

    // Click cancel button
    this.getServiceCancelButton().should('be.visible').first().click();

    // Verify redirection to services list
    cy.url().should('include', '/customer/ssp-service');
  }

  /**
   * Verifies that a service state is 'Cancelled'
   */
  verifyServiceCancelled(): void {
    this.getStateCell().should('contain', 'Canceled');
  }
}
