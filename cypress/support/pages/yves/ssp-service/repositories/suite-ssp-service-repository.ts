import { injectable } from 'inversify';
import { SspServiceRepository } from '../ssp-service-repository';
import Chainable = Cypress.Chainable;

@injectable()
export class SuiteSspServiceRepository implements SspServiceRepository {
  getSspServiceTable(): Chainable<JQuery<HTMLElement>> {
    return cy.get('.ssp-service-table');
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

  getSortColumnByName(columnName: string): Chainable<any> {
    return cy.contains('th div', columnName);
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
  
  getSearchButton(): Chainable<any> {
    return cy.contains('button', 'Search');
  }
  
  getPagination(): Chainable<any> {
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

  getFirstRowViewDetailsButton(): Chainable<any> {
    return this.getSspServiceTableRows().first().find('a').contains('View');
  }
}
