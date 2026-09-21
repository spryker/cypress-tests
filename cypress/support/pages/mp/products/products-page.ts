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

  deletePriceRowByQuantity = (params: PriceRowParams): void => {
    cy.intercept('GET', '**/product-merchant-portal-gui/delete-price-product-abstract**').as('priceRowDeleted');

    // The price columns are configured server-side, so the quantity column is located by its
    // heading rather than by a position that a configuration change would silently move.
    this.repository.getPriceTableQuantityHeaderCell().then(($headerCell: JQuery<HTMLElement>) => {
      const columnIndex = $headerCell.index();

      this.repository
        .getPriceTableRows()
        .filter(
          (_rowIndex, row) => Cypress.$(row).find('td').eq(columnIndex).text().trim() === String(params.quantity),
          { timeout: 20000 }
        )
        .find(this.repository.getRowActionTriggerSelector(), { timeout: 20000 })
        .click();
    });

    this.repository.getRowActionItem(DELETE_ACTION_TITLE).click();

    cy.wait('@priceRowDeleted');
  };

  save = (): void => {
    cy.get(this.repository.getSaveButtonSelector()).click();
  };
}

const DELETE_ACTION_TITLE = 'Delete';

interface PriceRowParams {
  quantity: number;
}

interface FindParams {
  query: string;
  expectedCount?: number;
}
