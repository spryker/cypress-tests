import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { OffersRepository } from './offers-repository';

@injectable()
@autoWired
export class OffersPage extends MpPage {
  @inject(OffersRepository) private repository: OffersRepository;

  protected PAGE_URL = '/product-offer-merchant-portal-gui/product-offers';

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query, { delay: 0 });
    cy.get(searchSelector).type('{enter}');

    this.interceptTable({
      url: '/product-offer-merchant-portal-gui/product-offers/table-data**',
      expectedCount: params.expectedCount,
    });

    return this.repository.getFirstTableRow();
  };

  getDrawer = (): Cypress.Chainable => {
    return this.repository.getDrawer();
  };

  getSaveButtonSelector = (): string => {
    return this.repository.getSaveButtonSelector();
  };

  // Creating an offer runs in two steps: choosing the product it is offered on, then filling the
  // offer's own form, whose price table is the same editable table the offer drawer uses.
  createOffer = (params: CreateOfferParams): void => {
    cy.intercept('POST', '**/product-offer-merchant-portal-gui/create-product-offer**').as('offerCreated');

    this.repository.getAddOfferButton().click();

    // The product table has to have narrowed to the searched sku before a row is picked, or the
    // offer is created on whichever product the unfiltered list happened to list first.
    this.interceptTable({ url: '/product-offer-merchant-portal-gui/product-list/table-data**', expectedCount: 1 }, () =>
      this.repository.getProductSearchInput().type(`${params.concreteSku}{enter}`)
    );
    this.repository.getProductRows().first().click();

    this.repository.getMerchantSkuInput().type(params.merchantSku);
    this.repository.getIsActiveLabel().click();
    this.selectOptions(this.repository.getStoresSelect(), [params.storeName]);
    this.repository.getStockQuantityInput().clear().type(String(params.stockQuantity));

    this.repository.getPriceTableAddButton().click();
    this.repository.getPriceTableHeaderCells().then(($headerCells: JQuery<HTMLElement>) => {
      const columnIndexOf = (title: string): number =>
        Array.from($headerCells).findIndex((headerCell) => Cypress.$(headerCell).text().trim() === title);

      this.selectInEditableRow(columnIndexOf(STORE_COLUMN_TITLE), params.storeName);
      this.selectInEditableRow(columnIndexOf(CURRENCY_COLUMN_TITLE), params.currency);
      this.typeInEditableRow(columnIndexOf(NET_DEFAULT_COLUMN_TITLE), params.netAmount);
      this.typeInEditableRow(columnIndexOf(GROSS_DEFAULT_COLUMN_TITLE), params.grossAmount);
    });

    this.repository.getCreateOfferButton().click();

    cy.wait('@offerCreated');
  };

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
}

const STORE_COLUMN_TITLE = 'Store';
const CURRENCY_COLUMN_TITLE = 'Currency';
const NET_DEFAULT_COLUMN_TITLE = 'Net Default';
const GROSS_DEFAULT_COLUMN_TITLE = 'Gross Default';

interface CreateOfferParams {
  concreteSku: string;
  merchantSku: string;
  storeName: string;
  currency: string;
  netAmount: number;
  grossAmount: number;
  stockQuantity: number;
}

interface PriceRowParams {
  quantity: number;
}

interface FindParams {
  query: string;
  expectedCount?: number;
}
