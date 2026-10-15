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
  getPriceTableHeaderSelector = (): string => '.spy-drawer-wrapper th';
  getCostPriceColumnTitle = (): string => 'Cost Default';

  getPriceTable = (): Cypress.Chainable =>
    cy.get('.spy-drawer-wrapper table').filter(':has(th:contains("Cost Default"))').first();

  getEditableCellOverlaySelector = (): string => '.spy-table-editable-feature__wrapper';
  getEditableCellInputSelector = (): string => '.spy-table-editable-feature__float-col input[type="number"]';
  getEditableCellSaveButtonSelector = (): string =>
    '.spy-table-editable-feature__float-cell button.spy-button-core__btn';
  getDrawerSaveButtonSelector = (): string => '.mp-edit-abstract-product__header button.spy-button-core__btn';

  getSavePriceProductAbstractUrl = (): string => '/product-merchant-portal-gui/save-price-product-abstract**';
  getPriceTableDataUrl = (): string => '/product-merchant-portal-gui/update-product-abstract/table-data**';
  getUpdateProductAbstractUrl = (): string =>
    '/product-merchant-portal-gui/update-product-abstract?product-abstract-id=*';
}
