import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantRegistrationListRepository {
  // Page elements
  getPageTitle = (): Cypress.Chainable => cy.get('h1, .page-header h1');
  getTable = (): Cypress.Chainable => cy.get('table.table');
  getTableHeader = (): Cypress.Chainable => cy.get('thead');
  getTableRows = (): Cypress.Chainable => cy.get('tbody tr');
  getSearchInput = (): Cypress.Chainable => cy.get('input[type="search"]');
  getSortableColumn = (): Cypress.Chainable => cy.get('th.sorting, th.sorting_asc, th.sorting_desc');

  // Column selectors
  getIdColumn = (): string => 'td:nth-child(1)';
  getCreatedColumn = (): string => 'td:nth-child(2)';
  getMerchantColumn = (): string => 'td:nth-child(3)';
  getFullNameColumn = (): string => 'td:nth-child(4)';
  getEmailColumn = (): string => 'td:nth-child(5)';
  getStatusColumn = (): string => 'td:nth-child(6)';
  getActionsColumn = (): string => 'td:nth-child(7)';

  // Action buttons
  getViewButton = (): string => 'a:contains("View")';

  // Status badges
  getStatusPendingBadge = (): string => '.label-warning';
  getStatusAcceptedBadge = (): string => '.label-success';
  getStatusRejectedBadge = (): string => '.label-danger';
}
