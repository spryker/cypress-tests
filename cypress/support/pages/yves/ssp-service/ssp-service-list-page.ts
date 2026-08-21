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
    this.repository.getFirstRowViewDetailsButton().click({ force: true });
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

  openFilter(): void {
    this.repository.getFiltersTriggerSelector().click();
  }
}
