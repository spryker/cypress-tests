import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class OffersRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '.spy-table-search-feature input[type="text"]';
  getSaveButtonSelector = (): string => 'button:contains("Save")';
  getDrawer = (): Cypress.Chainable => cy.get('.spy-drawer-wrapper');

  // Waiting on the heading itself is what proves the price table has finished rendering; the
  // Angular bundle paints a skeleton header first.
  getPriceTableQuantityHeaderCell = (): Cypress.Chainable =>
    cy.contains('web-mp-offer-prices-table thead th', 'Volume Quantity', { timeout: 20000 });

  getPriceTableRows = (): Cypress.Chainable =>
    cy.get('web-mp-offer-prices-table tbody.ant-table-tbody tr.ant-table-row', { timeout: 20000 });

  getRowActionTriggerSelector = (): string => '.ant-table-row-actions-feature .ant-dropdown-trigger';

  // The row-action menu is rendered into the page-level overlay container, not inside the row.
  getRowActionItem = (title: string): Cypress.Chainable =>
    cy.get('.ant-dropdown-menu:visible li.ant-dropdown-menu-item').contains(title);

  getDeletePriceUrlPattern = (): string => '**/product-offer-merchant-portal-gui/delete-price-product-offer**';
}
