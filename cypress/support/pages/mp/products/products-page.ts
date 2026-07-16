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
    cy.get(searchSelector, { timeout: 20000 }).should('be.visible').clear();
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
      cy.get('@attributesTable')
        .should('be.visible')
        .then(() => {
          this.repository.getAddAttributeButton().click();
          cy.get('@createAttribute.all').should('have.length', 0);
        });
    });
  };

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
}

interface FindParams {
  query: string;
  expectedCount?: number;
}
