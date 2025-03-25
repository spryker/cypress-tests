import { injectable } from 'inversify';
import { SspServiceRepository } from '../ssp-service-repository';
import Chainable = Cypress.Chainable;

@injectable()
export class SuiteSspServiceRepository implements SspServiceRepository {
  getSspServiceTable(): Chainable<JQuery<HTMLElement>> {
    return cy.get('table.table--expand');
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
    return cy.get('.js-service-orderBy-target');
  }

  getSortDirectionInput(): Chainable<JQuery<HTMLElement>> {
    return cy.get('.js-service-orderDirection-target');
  }

  getResetButton(): Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-qa=reset-button]');
  }

  getSortColumnByName(columnName: string): Chainable<JQuery<HTMLElement>> {
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

  getFirstRowViewDetailsButton(): Chainable<JQuery<HTMLElement>> {
    return this.getSspServiceTableRows().first().find('a').contains('View');
  }
}
