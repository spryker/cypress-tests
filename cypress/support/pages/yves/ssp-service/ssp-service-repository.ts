import { injectable } from 'inversify';

// Import Cypress types
type Chainable<Subject = any> = Cypress.Chainable<Subject>;
type JQueryElement = JQuery<HTMLElement>;

@injectable()
export class SspServiceRepository {
  getSspServiceTable(): Chainable<JQueryElement> {
    return cy.get('.ssp-service-table');
  }

  getSspServiceTableRows(): Chainable<JQueryElement> {
    return this.getSspServiceTable().find('tbody tr');
  }

  getSspServiceTableHeaders(): Chainable<JQueryElement> {
    return this.getSspServiceTable().find('thead th');
  }

  getSortingTriggers(): Chainable<JQueryElement> {
    return cy.get('.js-service-sort-trigger');
  }

  getSortOrderByInput(): Chainable<JQueryElement> {
    return cy.get('.js-advanced-table-order-by-target');
  }

  getSortDirectionInput(): Chainable<JQueryElement> {
    return cy.get('.js-advanced-table-order-direction-target');
  }

  getResetButton(): Chainable<JQueryElement> {
    return cy.get('[data-qa=reset-button]');
  }
  
  getPagination(): Chainable<JQueryElement> {
    return cy.get('.pagination');
  }

  getSortColumnByName(columnName: string): Chainable<any> {
    return cy.contains('th div', columnName);
  }
  
  // Search form methods
  getSearchTypeSelect(): Chainable<JQueryElement> {
    return cy.get('select[name*="searchType"]');
  }
  
  getSearchTextInput(): Chainable<JQueryElement> {
    return cy.get('input[name*="searchText"]');
  }

  getBusinessUnitSelect(): Chainable<JQueryElement> {
    return cy.get('select[name*="companyBusinessUnit"]');
  }
  
  getSearchButton(): Chainable<any> {
    return cy.contains('button', 'Search');
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
