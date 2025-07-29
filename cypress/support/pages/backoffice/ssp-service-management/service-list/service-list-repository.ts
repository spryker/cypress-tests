import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ServiceListRepository {
  getServiceListTable = (): Cypress.Chainable => cy.get('table[data-ajax="/self-service-portal/list-service/table"]');

  getCustomerHeader = (): Cypress.Chainable => cy.get('th[data-qa="first_name"]');

  getViewButton = (): Cypress.Chainable => cy.get(this.getViewButtonSelector());

  getOrderReferenceHeader = (): Cypress.Chainable => cy.get('th[data-qa="order_reference"]');

  getCompanyHeader = (): Cypress.Chainable => cy.get('th[data-qa="company"]');

  getServiceHeader = (): Cypress.Chainable => cy.get('th[data-qa="service"]');

  getScheduledAtHeader = (): Cypress.Chainable => cy.get('th[data-qa="scheduled_at"]');

  getCreatedAtHeader = (): Cypress.Chainable => cy.get('th[data-qa="created_at"]');

  getActionsHeader = (): Cypress.Chainable => cy.get('th[data-qa="Actions"]');

  getTableRows = (): Cypress.Chainable => cy.get('tbody tr');

  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody tr').first();

  getOrderReferenceCell = (): Cypress.Chainable => cy.get('td.column-order_reference');

  getCustomerNameCell = (): Cypress.Chainable => cy.get('td.column-first_name');

  getCompanyCell = (): Cypress.Chainable => cy.get('td.column-company');

  getServiceCell = (): Cypress.Chainable => cy.get('td.column-service');

  getScheduledDateCell = (): Cypress.Chainable => cy.get('td.column-scheduled_at');

  getCreatedDateCell = (): Cypress.Chainable => cy.get('td.column-created_at');

  getActionsCell = (): Cypress.Chainable => cy.get('td.column-Actions');

  getViewButtonSelector = (): string => '[data-qa="view-button"]';
}
