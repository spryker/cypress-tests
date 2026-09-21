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

  getPriceTableCustomerHeaderCell = (): Cypress.Chainable =>
    cy.contains('web-mp-edit-abstract-product-prices thead th', 'Customer', { timeout: 20000 });

  getPriceTableHeaderCells = (): Cypress.Chainable =>
    cy.get('web-mp-edit-abstract-product-prices thead th', { timeout: 20000 });

  getPriceTableAddButton = (): Cypress.Chainable =>
    cy.get('web-mp-edit-abstract-product-prices button:contains("Add")');

  // A row being added or edited is inserted at the top of the price table.
  getEditableRowCell = (columnIndex: number): Cypress.Chainable =>
    this.getPriceTableRows().first().find('td').eq(columnIndex);

  getEditableSelectSelector = (): string => 'nz-select-top-control';

  // ng-zorro renders the open dropdown into the page-level overlay container.
  getEditableSelectOption = (optionText: string): Cypress.Chainable =>
    cy.get('.ant-select-dropdown:visible .ant-select-item-option').contains(optionText);

  getNumberInputSelector = (): string => 'input[type="number"]';

  getPriceTableRows = (): Cypress.Chainable =>
    cy.get('web-mp-edit-abstract-product-prices tbody.ant-table-tbody tr.ant-table-row', { timeout: 20000 });

  getRowActionTriggerSelector = (): string => '.ant-table-row-actions-feature .ant-dropdown-trigger';

  getDeletePriceUrlPattern = (): string => '**/product-merchant-portal-gui/delete-price-product-abstract**';

  // The row-action menu is rendered into the page-level overlay container, not inside the row.
  getRowActionItem = (title: string): Cypress.Chainable =>
    cy.get('.ant-dropdown-menu:visible li.ant-dropdown-menu-item').contains(title);
}
