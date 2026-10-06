import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class SalesOrdersRepository {
  getFirstTableRow = (params?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    cy.get('tbody > :nth-child(1):visible', params);
  getSearchSelector = (): string => '.spy-table-search-feature input[type="text"]';
  getCancelButtonSelector = (): string => 'button:contains("Cancel")';
  getShipButtonSelector = (): string => 'button:contains("Ship")';
  getSendToDistributionButtonSelector = (): string => 'button:contains("send to distribution")';
  getConfirmAtCenterButtonSelector = (): string => 'button:contains("confirm at center")';
  getDeliverButtonSelector = (): string => 'button:contains("Deliver")';
  getRefundButtonSelector = (): string => 'button:contains("Refund")';
  getDrawer = (): Cypress.Chainable => cy.get('.spy-drawer-wrapper');
  getOrderItemsStateChipSelector = (): string => 'web-spy-chips.mp-manage-order__states-col';

  getItemsTab = (): Cypress.Chainable => cy.contains('.ant-tabs-tab-btn', 'Items', { timeout: 20000 });

  getOrderItemHeaderCell = (title: string): Cypress.Chainable =>
    cy.contains('web-mp-order-items-table thead th', title, { timeout: 20000 });

  getOrderItemRows = (): Cypress.Chainable =>
    cy.get('web-mp-order-items-table tbody.ant-table-tbody tr.ant-table-row', { timeout: 20000 });

  getRowActionTriggerSelector = (): string => '.ant-table-row-actions-feature .ant-dropdown-trigger';

  // The row-action menu is rendered into the page-level overlay container, not inside the row.
  getRowActionItem = (title: string): Cypress.Chainable =>
    cy.get('.ant-dropdown-menu:visible li.ant-dropdown-menu-item').contains(title);
}
