import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { ProductsRepository } from './products-repository';

@injectable()
@autoWired
export class ProductsPage extends MpPage {
  @inject(ProductsRepository) private repository: ProductsRepository;

  protected PAGE_URL = '/product-merchant-portal-gui/products';

  // The search request fires on enter, so the intercept is registered before the key is pressed —
  // pressing first races the response and the wait then never sees a request at all.
  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector, { timeout: 20000 }).should('be.visible').clear();
    cy.get(searchSelector).type(params.query, { delay: 0 });

    this.interceptTable(
      {
        url: '/product-merchant-portal-gui/products/table-data**',
        expectedCount: params.expectedCount,
      },
      () => {
        cy.get(searchSelector).type('{enter}');
      }
    );

    return this.repository.getFirstTableRow();
  };

  // Saving an abstract product closes its drawer, so every stage of a journey opens it again. The
  // search is typed only once the unfiltered table has rendered, or the input is not there yet.
  openProduct = (params: FindParams): void => {
    this.visit();
    this.repository.getFirstTableRow();
    this.find(params).click();
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

  openProductBySku = (sku: string): void => {
    cy.intercept('GET', this.repository.getUpdateProductAbstractUrl()).as('updateProductAbstract');
    cy.intercept('GET', this.repository.getPriceTableDataUrl()).as('openPriceTableReload');
    this.repository.getFirstTableRow().should('contain.text', sku);
    this.repository.getFirstTableRow().contains(sku).click();
    cy.wait('@updateProductAbstract');
    cy.wait('@openPriceTableReload').its('response.statusCode').should('eq', 200);
    this.repository.getPriceTable().should('exist');
    this.repository.getPriceTable().find('tbody tr').should('have.length.at.least', 1);
  };

  getPriceTableHeaders = (): Cypress.Chainable => cy.get(this.repository.getPriceTableHeaderSelector());

  getCostPriceColumnTitle = (): string => this.repository.getCostPriceColumnTitle();

  getCostColumnIndex = (): Cypress.Chainable =>
    this.repository
      .getPriceTable()
      .find('thead th')
      .then(($headers) =>
        $headers.toArray().findIndex((th) => th.textContent?.trim() === this.getCostPriceColumnTitle())
      );

  getCostColumnValues = (): Cypress.Chainable =>
    this.getCostColumnIndex().then((costColumnIndex) =>
      this.repository
        .getPriceTable()
        .find('tbody tr')
        .then(($rows) =>
          $rows.toArray().map((tr) => tr.querySelectorAll('td')[costColumnIndex]?.textContent?.trim() ?? '')
        )
    );

  editFirstCostAmount = (value: string): void => {
    this.getCostColumnIndex().then((costColumnIndex) => {
      this.repository.getPriceTable().find('tbody tr').first().find('td').eq(costColumnIndex).as('costCell');

      this.applyCostCellEdit('@costCell', value);
    });
  };

  editCostAmountByCurrentValue = (currentValue: string, newValue: string): void => {
    this.getCostColumnIndex().then((costColumnIndex) => {
      this.repository
        .getPriceTable()
        .find('tbody tr')
        .filter(
          (_index, row) => (row.querySelectorAll('td')[costColumnIndex]?.textContent?.trim() ?? '') === currentValue
        )
        .first()
        .find('td')
        .eq(costColumnIndex)
        .as('costCell');

      this.applyCostCellEdit('@costCell', newValue);
    });
  };

  private applyCostCellEdit = (cellAlias: string, value: string): void => {
    cy.get(cellAlias).find(this.repository.getEditableCellOverlaySelector()).scrollIntoView();
    cy.get(cellAlias).find(this.repository.getEditableCellOverlaySelector()).click({ force: true });

    cy.get(this.repository.getEditableCellInputSelector()).should('be.visible').clear();
    cy.get(this.repository.getEditableCellInputSelector()).type(value);

    cy.intercept('POST', this.repository.getSavePriceProductAbstractUrl()).as('savePriceProductAbstract');
    cy.intercept('GET', this.repository.getPriceTableDataUrl()).as('priceTableReload');

    cy.contains(this.repository.getEditableCellSaveButtonSelector(), 'Save').click({ force: true });

    cy.wait('@savePriceProductAbstract').its('response.statusCode').should('eq', 200);
    cy.wait('@priceTableReload').its('response.statusCode').should('eq', 200);
    cy.get(this.repository.getEditableCellInputSelector()).should('not.exist');
  };

  saveDrawer = (): void => {
    cy.intercept('POST', this.repository.getUpdateProductAbstractUrl()).as('saveProductAbstract');
    cy.contains(this.repository.getDrawerSaveButtonSelector(), 'Save').should('be.enabled').scrollIntoView();
    cy.contains(this.repository.getDrawerSaveButtonSelector(), 'Save').click();
    cy.wait('@saveProductAbstract').its('response.statusCode').should('eq', 200);
  };

  getDrawerAlias = (): Cypress.Chainable => cy.get('@drawer');

  selectTaxIdSetOption = (value: string | number | string[]): Cypress.Chainable =>
    cy.get(this.repository.getTaxIdSelector()).select(value, { force: true });

  // The create wizard runs in two steps: naming the abstract product, then choosing the super
  // attribute whose values become its concrete products.
  createMultiConcreteProduct = (params: CreateMultiConcreteProductParams): void => {
    cy.intercept('POST', '**/product-merchant-portal-gui/create-product-abstract**').as('abstractProductCreated');

    this.repository.getCreateProductButton().click();
    this.repository.getCreateProductSkuInput().type(params.sku);
    this.repository.getCreateProductNameInput().type(params.name);
    this.repository.getMultipleConcretesRadioLabel().click();
    this.repository.getWizardNextButton().click();

    this.selectOption(this.repository.getSuperAttributeSelect(), params.attributeName);
    this.selectOptions(this.repository.getSuperAttributeValuesSelect(), params.attributeValues);

    this.repository.getAddConcretesButton().click();
    this.repository.getWizardCreateButton().click();

    cy.wait('@abstractProductCreated');
  };

  openConcreteProductsTab = (): void => {
    this.repository.getConcreteProductsTab().click();
  };

  // The overlay offers the attribute values that have no concrete product yet, and creates one per
  // value that is picked.
  addConcreteProducts = (params: AddConcreteProductsParams): void => {
    cy.intercept('POST', '**/product-merchant-portal-gui/add-product-concrete**').as('concreteProductsAdded');

    this.repository.getAddConcreteProductsButton().click();
    this.selectOptions(this.repository.getConcreteAttributeValuesSelect(), params.attributeValues);
    this.repository.getCreateConcreteProductsButton().click();

    cy.wait('@concreteProductsAdded');
  };

  // A concrete added through the overlay gets an autogenerated sku, so its row is found by the
  // super-attribute value that distinguishes it.
  openConcreteProduct = (params: OpenConcreteProductParams): void => {
    this.repository.getVariantRows().filter(`:contains("${params.rowText}")`).first().click();
  };

  // A concrete product has to be named in every locale before it can be saved, and taking the
  // abstract product's name is what the merchant does rather than retyping it per locale. Without a
  // searchable locale the product never reaches the storefront catalog.
  activateConcreteProduct = (params: ActivateConcreteProductParams): void => {
    this.repository.getConcreteIsActiveLabel().click();
    this.repository.getConcreteStockQuantityInput().clear().type(String(params.stockQuantity));
    this.repository.getUseAbstractProductNameLabel().click();
    this.selectOptions(this.repository.getSearchabilitySelect(), params.searchableLocales);
  };

  sendForApproval = (): void => {
    this.repository.getSendForApprovalButton().click();
  };

  // A row added to the price table is submitted with the abstract product form, not on its own.
  addPriceRow = (params: AddPriceRowParams): void => {
    cy.intercept('POST', '**/product-merchant-portal-gui/update-product-abstract**').as('abstractProductSaved');

    this.repository.getPriceTableAddButton().click();

    this.repository.getPriceTableHeaderCells().then(($headerCells: JQuery<HTMLElement>) => {
      const columnIndexOf = (title: string): number =>
        Array.from($headerCells).findIndex((headerCell) => Cypress.$(headerCell).text().trim() === title);

      // The customer options are labelled '<merchant relation id> - <business unit name>', and the
      // id is only known once the relation has been created.
      if (params.customerBusinessUnitName) {
        this.selectInEditableRow(columnIndexOf(CUSTOMER_COLUMN_TITLE), params.customerBusinessUnitName);
      }

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
    this.selectOption(
      this.repository.getEditableRowCell(columnIndex).find(this.repository.getEditableSelectSelector()),
      optionText
    );
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

  getPriceRowsByQuantity = (params: PriceRowParams): Cypress.Chainable =>
    this.getPriceTableRowsByCell({
      getMatchColumnHeaderCell: this.repository.getPriceTableQuantityHeaderCell,
      getRows: this.repository.getPriceTableRows,
      isMatchingCell: (cellText) => cellText === String(params.quantity),
    });

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

  // A concrete drawer opens on top of the abstract one, so the last Save in the DOM is the one
  // belonging to the drawer in front.
  save = (): void => {
    cy.get(this.repository.getSaveButtonSelector()).last().click();
  };
}

const CUSTOMER_COLUMN_TITLE = 'Customer';
const STORE_COLUMN_TITLE = 'Store';
const CURRENCY_COLUMN_TITLE = 'Currency';
const NET_DEFAULT_COLUMN_TITLE = 'Net Default';
const GROSS_DEFAULT_COLUMN_TITLE = 'Gross Default';

interface AddConcreteProductsParams {
  attributeValues: string[];
}

interface OpenConcreteProductParams {
  rowText: string;
}

interface ActivateConcreteProductParams {
  stockQuantity: number;
  searchableLocales: string[];
}

interface AddPriceRowParams {
  customerBusinessUnitName?: string;
  storeName: string;
  currency: string;
  netAmount: number;
  grossAmount: number;
}

interface CreateMultiConcreteProductParams {
  sku: string;
  name: string;
  attributeName: string;
  attributeValues: string[];
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
