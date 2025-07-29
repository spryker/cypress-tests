import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ServiceListRepository {
  getServiceListTable = () => cy.get('table[data-ajax="/self-service-portal/list-service/table"]');

  getCustomerHeader = () => cy.get('th[data-qa="first_name"]');

  getViewButton = () => cy.get(this.getViewButtonSelector());

  getOrderReferenceHeader = () => cy.get('th[data-qa="order_reference"]');

  getCompanyHeader = () => cy.get('th[data-qa="company"]');

  getServiceHeader = () => cy.get('th[data-qa="service"]');

  getScheduledAtHeader = () => cy.get('th[data-qa="scheduled_at"]');

  getCreatedAtHeader = () => cy.get('th[data-qa="created_at"]');

  getActionsHeader = () => cy.get('th[data-qa="Actions"]');

  getTableRows = () => cy.get('tbody tr');

  getFirstTableRow = () => cy.get('tbody tr').first();

  getOrderReferenceCell = () => cy.get('td.column-order_reference');

  getCustomerNameCell = () => cy.get('td.column-first_name');

  getCompanyCell = () => cy.get('td.column-company');

  getServiceCell = () => cy.get('td.column-service');

  getScheduledDateCell = () => cy.get('td.column-scheduled_at');

  getCreatedDateCell = () => cy.get('td.column-created_at');

  getActionsCell = () => cy.get('td.column-Actions');

  getViewButtonSelector = (): string => '[data-qa="view-button"]';
}
