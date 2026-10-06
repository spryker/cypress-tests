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

  getAddOfferButton = (): Cypress.Chainable => cy.contains('a, button', 'Add Offer');

  getProductSearchInput = (): Cypress.Chainable =>
    cy.get('input[placeholder="Search by SKU, Name"]', { timeout: 20000 });

  getProductRows = (): Cypress.Chainable => cy.get('tbody.ant-table-tbody tr.ant-table-row', { timeout: 20000 });

  getMerchantSkuInput = (): Cypress.Chainable => cy.get('input[name="productOffer[merchantSku]"]', { timeout: 20000 });

  // The checkbox only reaches the Angular form when its own label is clicked.
  getIsActiveLabel = (): Cypress.Chainable =>
    cy.get('web-spy-checkbox[name="productOffer[isActive]"] label.ant-checkbox-wrapper');

  getStoresSelect = (): Cypress.Chainable =>
    cy.get('web-spy-select[name="productOffer[stores][]"] nz-select-top-control');

  getStockQuantityInput = (): Cypress.Chainable => cy.get('input[name="productOffer[productOfferStocks][quantity]"]');

  getPriceTableAddButton = (): Cypress.Chainable => cy.get('web-mp-offer-prices-table button:contains("Add")');

  getPriceTableHeaderCells = (): Cypress.Chainable => cy.get('web-mp-offer-prices-table thead th', { timeout: 20000 });

  // A row being added or edited is inserted at the top of the price table.
  getEditableRowCell = (columnIndex: number): Cypress.Chainable =>
    this.getPriceTableRows().first().find('td').eq(columnIndex);

  getEditableSelectSelector = (): string => 'nz-select-top-control';

  getNumberInputSelector = (): string => 'input[type="number"]';

  getCreateOfferButton = (): Cypress.Chainable => cy.contains('web-mp-edit-offer button', 'Create');
}
