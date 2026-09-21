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

  getCreateProductButton = (): Cypress.Chainable => cy.contains('a, button', 'Create Product');

  getStoresSelect = (): Cypress.Chainable =>
    cy.get('web-spy-select[spy-id="productAbstract_stores"] nz-select-top-control', { timeout: 20000 });

  getConcreteProductsTab = (): Cypress.Chainable => cy.contains('.ant-tabs-tab-btn', 'Concrete Products');

  getVariantRows = (): Cypress.Chainable =>
    cy.get('web-mp-edit-abstract-product-variants tbody.ant-table-tbody tr.ant-table-row', { timeout: 20000 });

  // The checkbox only reaches the Angular form when its own label is clicked.
  getConcreteIsActiveLabel = (): Cypress.Chainable =>
    cy.get('web-spy-checkbox[spy-id="productConcreteEdit_productConcrete_isActive"] label.ant-checkbox-wrapper', {
      timeout: 20000,
    });

  getUseAbstractProductNameLabel = (): Cypress.Chainable =>
    cy.get('web-mp-content-toggle[name="productConcreteEdit[useAbstractProductName]"] label.ant-checkbox-wrapper', {
      timeout: 20000,
    });

  getConcreteStockQuantityInput = (): Cypress.Chainable =>
    cy.get('input[name="productConcreteEdit[productConcrete][stocks][quantity]"]', { timeout: 20000 });

  // Rendered as a link rather than a button, and only once the abstract product is complete.
  getSearchabilitySelect = (): Cypress.Chainable =>
    cy.get('web-spy-select[spy-id="productConcreteEdit_searchability"] nz-select-top-control', { timeout: 20000 });

  getSendForApprovalButton = (): Cypress.Chainable =>
    cy.get('a[href*="product-abstract-approval"][href*="waiting_for_approval"]', { timeout: 20000 });

  getApprovalStatusChip = (): Cypress.Chainable =>
    cy.get('.mp-edit-abstract-product__approval-status', { timeout: 20000 });

  // One input per locale, each rendered behind its own locale tab but all present in the form.
  getLocalizedNameInputs = (): Cypress.Chainable =>
    cy.get('input[name^="productAbstract[localizedAttributes]"][name$="[name]"]', { timeout: 20000 });

  getCreateProductSkuInput = (): Cypress.Chainable =>
    cy.get('input[name="create_product_abstract_form[sku]"]', { timeout: 20000 });

  getCreateProductNameInput = (): Cypress.Chainable => cy.get('input[name="create_product_abstract_form[name]"]');

  // The radio only reaches the Angular form when its own label is clicked.
  getMultipleConcretesRadioLabel = (): Cypress.Chainable =>
    cy.contains('label.ant-radio-wrapper', 'multiple concrete products');

  getSuperAttributeSelect = (): Cypress.Chainable =>
    cy.get('.mp-product-attributes-selector__content-row-name nz-select-top-control', { timeout: 20000 });

  getSuperAttributeValuesSelect = (): Cypress.Chainable =>
    cy.get('.mp-product-attributes-selector__content-row-values-name-select nz-select-top-control');

  getAddConcretesButton = (): Cypress.Chainable => cy.get('.mp-product-attributes-selector__button-add button');

  getWizardNextButton = (): Cypress.Chainable => cy.contains('.spy-drawer-wrapper button', 'Next');

  getWizardCreateButton = (): Cypress.Chainable => cy.contains('.spy-drawer-wrapper button', 'Create');

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
  getSelectOption = (optionText: string): Cypress.Chainable =>
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
