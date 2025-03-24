import { injectable } from 'inversify';

// Import Cypress types
type Chainable<Subject = any> = Cypress.Chainable<Subject>;
type JQueryElement = JQuery<HTMLElement>;

@injectable()
export class SspServiceRepository {
  getSspServiceTable(): Chainable<JQueryElement> {
    return cy.get('table.table--expand');
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
    return cy.get('input[name="orderBy"]');
  }

  getSortDirectionInput(): Chainable<JQueryElement> {
    return cy.get('input[name="orderDirection"]');
  }

  getResetButton(): Chainable<JQueryElement> {
    return cy.contains('button', 'Reset');
  }

  getPagination(): Chainable<JQueryElement> {
    return cy.get('.pagination');
  }

  getSortColumnByName(columnName: string): Chainable<JQueryElement> {
    return cy.contains('th a', columnName);
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

  getFirstRowViewDetailsButton(): Chainable<JQueryElement> {
    return this.getSspServiceTableRows().first().find('a').contains('View');
  }
}
