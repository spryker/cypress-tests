import { injectable } from 'inversify';
import { SspServiceRepository } from '../ssp-service-repository';
import Chainable = Cypress.Chainable;

@injectable()
export class B2bSspServiceRepository implements SspServiceRepository {
  getSspServiceTable(): Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-qa*="advanced-table"]');
  }

  getSspServiceTableRows(): Chainable<JQuery<HTMLElement>> {
    return this.getSspServiceTable().find('tbody tr');
  }

  getSspServiceTableHeaders(): Chainable<JQuery<HTMLElement>> {
    return this.getSspServiceTable().find('thead th');
  }

  getSortingTriggers(): Chainable<JQuery<HTMLElement>> {
    return cy.get('.js-service-sort-trigger');
  }

  getSortOrderByInput(): Chainable<JQuery<HTMLElement>> {
    return cy.get('.js-advanced-table-order-by-target');
  }

  getSortDirectionInput(): Chainable<JQuery<HTMLElement>> {
    return cy.get('.js-advanced-table-order-direction-target');
  }

  getResetButton(): Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-qa=reset-button]');
  }

  getSortColumnByName(columnName: string): Chainable<JQuery<HTMLElement>> {
    return cy.contains('.advanced-table th', columnName);
  }

  // Search form methods
  getSearchTypeSelect(): Chainable<JQuery<HTMLElement>> {
    return cy.get('select[name*="searchType"]');
  }

  getSearchTextInput(): Chainable<JQuery<HTMLElement>> {
    return cy.get('input[name*="searchText"]');
  }

  getBusinessUnitSelect(): Chainable<JQuery<HTMLElement>> {
    return cy.get('select[name*="companyBusinessUnit"]');
  }

  getSearchButton(): Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-qa="submit-filters"]');
  }

  getPagination(): Chainable<JQuery<HTMLElement>> {
    return cy.get('.pagination');
  }

  getFirstRowReference(): string {
    let reference = '';

    this.getSspServiceTableRows()
      .first()
      .find('td')
      .first()
      .invoke('text')
      .then((text: string) => {
        reference = text.trim();
      });

    return reference;
  }

  getFirstRowViewDetailsButton(): Chainable<JQuery<HTMLElement>> {
    return this.getSspServiceTableRows().first().find('a').contains('View') as unknown as Chainable<
      JQuery<HTMLElement>
    >;
  }

  getDetailsPageRescheduleButton(): Chainable<JQuery<HTMLElement>> {
    return cy.get('a[data-qa="reschedule-button"]') as unknown as Chainable<JQuery<HTMLElement>>;
  }

  getRescheduleFormDateInput(): Chainable<JQuery<HTMLElement>> {
    return cy.get('input[data-qa="reschedule-date"]');
  }

  getRescheduleFormTimeInput(): Chainable<JQuery<HTMLElement>> {
    return cy.get('input[data-qa="reschedule-time"]');
  }

  getRescheduleFormSubmitButton(): Chainable<JQuery<HTMLElement>> {
    return cy.get('button[data-qa="submit-button"]') as unknown as Chainable<JQuery<HTMLElement>>;
  }

  getServiceCancelButton(): Chainable<JQuery<HTMLElement>> {
    return cy.get('button[data-qa="cancel-service-button"]') as unknown as Chainable<JQuery<HTMLElement>>;
  }

  getSspServicePageTitle(): Cypress.Chainable {
    return cy.get('h3');
  }

  getFiltersTriggerSelector(): Cypress.Chainable {
    return cy.get('[data-qa="component filters-button"]');
  }
}
