import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { ProductsRepository } from './products-repository';

@injectable()
@autoWired
export class ProductsPage extends MpPage {
  @inject(ProductsRepository) private repository: ProductsRepository;

  protected PAGE_URL = '/product-merchant-portal-gui/products';

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query, { delay: 0 });
    cy.get(searchSelector).type('{enter}');

    this.interceptTable({
      url: '/product-merchant-portal-gui/products/table-data**',
      expectedCount: params.expectedCount,
    });

    return this.repository.getFirstTableRow();
  };

  getFirstTableRow = (): Cypress.Chainable => {
    return this.repository.getFirstTableRow();
  };

  getAddAttributeButton = (): Cypress.Chainable => {
    return this.repository.getAddAttributeButton();
  };

  clickAddAttributeButton = (): void => {
    cy.intercept('GET', '/product-merchant-portal-gui/update-product-abstract/table-data**').as('dataTable');
    cy.intercept('GET', '/product-merchant-portal-gui/update-product-abstract').as('createAttribute');

    cy.wait('@dataTable').then(() => {
      cy.get(this.repository.getAttributesTableSelector()).as('attributesTable');
      cy.get('@attributesTable').scrollIntoView();
      cy.get('@attributesTable').then(() => {
        this.repository.getAddAttributeButton().click();
      });
    });
  };

  getCreateAttributeRequests = (): Cypress.Chainable => cy.get('@createAttribute.all');

  getAttributesTableSelector = (): string => {
    return this.repository.getAttributesTableSelector();
  };

  getDrawer = (): Cypress.Chainable => {
    const drawer = this.repository.getDrawer();

    // Wait for the drawer to be visible
    this.interceptTable({
      url: '/product-merchant-portal-gui/products-concrete/table-data**',
      expectedCount: 1,
    });

    return drawer;
  };

  getSaveButtonSelector = (): string => {
    return this.repository.getSaveButtonSelector();
  };

  getTaxIdSetSelector = (): string => {
    return this.repository.getTaxIdSelector();
  };

  getTaxIdSetOptionSelector = (): string => {
    return this.repository.getTaxIdOptionSelector();
  };

  getDrawerAlias = (): Cypress.Chainable => cy.get('@drawer');

  selectTaxIdSetOption = (value: string | number | string[]): Cypress.Chainable =>
    cy.get(this.repository.getTaxIdSelector()).select(value, { force: true });

  // A row added to the price table is submitted with the abstract product form, not on its own.
  addCustomerPriceRow = (params: AddCustomerPriceRowParams): void => {
    cy.intercept('POST', '**/product-merchant-portal-gui/update-product-abstract**').as('abstractProductSaved');

    this.repository.getPriceTableAddButton().click();

    this.repository.getPriceTableHeaderCells().then(($headerCells: JQuery<HTMLElement>) => {
      const columnIndexOf = (title: string): number =>
        Array.from($headerCells).findIndex((headerCell) => Cypress.$(headerCell).text().trim() === title);

      // The customer options are labelled '<merchant relation id> - <business unit name>', and the
      // id is only known once the relation has been created.
      this.selectInEditableRow(columnIndexOf(CUSTOMER_COLUMN_TITLE), params.customerBusinessUnitName);
      this.selectInEditableRow(columnIndexOf(STORE_COLUMN_TITLE), params.storeName);
      this.selectInEditableRow(columnIndexOf(CURRENCY_COLUMN_TITLE), params.currency);
      this.typeInEditableRow(columnIndexOf(NET_DEFAULT_COLUMN_TITLE), params.netAmount);
      this.typeInEditableRow(columnIndexOf(GROSS_DEFAULT_COLUMN_TITLE), params.grossAmount);
    });

    this.save();

    cy.wait('@abstractProductSaved');
  };

  // The cell renders an Angular select whose options only reach the form when they are picked from
  // its own dropdown; writing the native mirror select leaves the row empty on save.
  private selectInEditableRow = (columnIndex: number, optionText: string): void => {
    this.repository.getEditableRowCell(columnIndex).find(this.repository.getEditableSelectSelector()).click();
    this.repository.getEditableSelectOption(optionText).click();
  };

  private typeInEditableRow = (columnIndex: number, amount: number): void => {
    this.repository
      .getEditableRowCell(columnIndex)
      .find(this.repository.getNumberInputSelector())
      .type(String(amount), { force: true });
  };

  deletePriceRowByQuantity = (params: PriceRowParams): void => {
    this.deletePriceTableRow({
      getMatchColumnHeaderCell: this.repository.getPriceTableQuantityHeaderCell,
      getRows: this.repository.getPriceTableRows,
      getActionItem: this.repository.getRowActionItem,
      isMatchingCell: (cellText) => cellText === String(params.quantity),
      rowActionTriggerSelector: this.repository.getRowActionTriggerSelector(),
      deleteUrlPattern: this.repository.getDeletePriceUrlPattern(),
    });
  };

  deletePriceRowByCustomer = (params: CustomerPriceRowParams): void => {
    this.deletePriceTableRow({
      getMatchColumnHeaderCell: this.repository.getPriceTableCustomerHeaderCell,
      getRows: this.repository.getPriceTableRows,
      getActionItem: this.repository.getRowActionItem,
      // The customer cell reads '<merchant relation id> - <business unit name>'.
      isMatchingCell: (cellText) => cellText.includes(params.customerBusinessUnitName),
      rowActionTriggerSelector: this.repository.getRowActionTriggerSelector(),
      deleteUrlPattern: this.repository.getDeletePriceUrlPattern(),
    });
  };

  save = (): void => {
    cy.get(this.repository.getSaveButtonSelector()).click();
  };
}

const CUSTOMER_COLUMN_TITLE = 'Customer';
const STORE_COLUMN_TITLE = 'Store';
const CURRENCY_COLUMN_TITLE = 'Currency';
const NET_DEFAULT_COLUMN_TITLE = 'Net Default';
const GROSS_DEFAULT_COLUMN_TITLE = 'Gross Default';

interface AddCustomerPriceRowParams {
  customerBusinessUnitName: string;
  storeName: string;
  currency: string;
  netAmount: number;
  grossAmount: number;
}

interface CustomerPriceRowParams {
  customerBusinessUnitName: string;
}

interface PriceRowParams {
  quantity: number;
}

interface FindParams {
  query: string;
  expectedCount?: number;
}
