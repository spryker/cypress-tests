import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductsRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '.spy-table-search-feature input[type="text"]';
  getSaveButtonSelector = (): string => 'button:contains("Save")';
  getTaxIdSelector = (): string => 'select[name="productAbstract[idTaxSet]"]';
  getTaxIdOptionSelector = (): string => 'select[name="productAbstract[idTaxSet]"] > option';
  getDrawer = (): Cypress.Chainable => cy.get('.spy-drawer-wrapper');
  getAddAttributeButton = (): Cypress.Chainable => cy.get('.product-attributes-table button:contains("Add")');
  getAttributesTableSelector = (): string => '.product-attributes-table';

  // Waiting on the heading itself is what proves the price table has finished rendering; the
  // Angular bundle paints a skeleton header first.
  getPriceTableQuantityHeaderCell = (): Cypress.Chainable =>
    cy.contains('web-mp-edit-abstract-product-prices thead th', 'Quantity', { timeout: 20000 });

  getPriceTableRows = (): Cypress.Chainable =>
    cy.get('web-mp-edit-abstract-product-prices tbody.ant-table-tbody tr.ant-table-row', { timeout: 20000 });

  getRowActionTriggerSelector = (): string => '.ant-table-row-actions-feature .ant-dropdown-trigger';

  getDeletePriceUrlPattern = (): string => '**/product-merchant-portal-gui/delete-price-product-abstract**';

  // The row-action menu is rendered into the page-level overlay container, not inside the row.
  getRowActionItem = (title: string): Cypress.Chainable =>
    cy.get('.ant-dropdown-menu:visible li.ant-dropdown-menu-item').contains(title);
}
