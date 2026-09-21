import { injectable } from 'inversify';

import { AbstractPage } from '../abstract-page';
import VisitOptions = Cypress.VisitOptions;

@injectable()
export class MpPage extends AbstractPage {
  visit = (options?: Partial<VisitOptions>): void => {
    cy.visitMerchantPortal(this.PAGE_URL, options);
  };

  clearSessionCookie = (): void => {
    cy.clearCookie(Cypress.env('merchantPortalSessionCookieName'));
  };

  protected interceptTable = (params: InterceptMpGuiTableParams, customFunction?: () => void): void => {
    const expectedCount = params.expectedCount ?? 1;
    const interceptAlias = this.faker.string.uuid();

    cy.intercept('GET', params.url).as(interceptAlias);

    if (customFunction) {
      customFunction();
    }

    // eslint-disable-next-line spryker-cypress/no-assertions-in-page-objects -- Internal retry/settle guard on the GUI-table intercept; not a spec-level assertion.
    cy.wait(`@${interceptAlias}`, { timeout: 10000 })
      .its('response.body.total')
      .should((total: number) => {
        const valueToBeAtMost = expectedCount + Cypress.currentRetry;
        assert.isTrue(total === expectedCount || total >= valueToBeAtMost);
      });
  };

  /**
   * The Merchant Portal renders abstract-product prices and offer prices with the same editable
   * table, so the deletion mechanics are shared and only the selectors and the endpoint differ.
   */
  protected deletePriceTableRow = (params: DeletePriceTableRowParams): void => {
    cy.intercept('GET', params.deleteUrlPattern).as('priceRowDeleted');

    // The price columns are configured server-side, so the quantity column is located by its
    // heading rather than by a position that a configuration change would silently move.
    params.getMatchColumnHeaderCell().then(($headerCell: JQuery<HTMLElement>) => {
      const columnIndex = $headerCell.index();

      params
        .getRows()
        .filter((_rowIndex, row) => params.isMatchingCell(Cypress.$(row).find('td').eq(columnIndex).text().trim()), {
          timeout: PRICE_TABLE_TIMEOUT,
        })
        .find(params.rowActionTriggerSelector, { timeout: PRICE_TABLE_TIMEOUT })
        .click();
    });

    params.getActionItem(DELETE_ACTION_TITLE).click();

    cy.wait('@priceRowDeleted');
  };
}

// The Angular bundle paints the table well after page load, and re-renders it once more when the
// row actions arrive.
const PRICE_TABLE_TIMEOUT = 20000;
const DELETE_ACTION_TITLE = 'Delete';

interface DeletePriceTableRowParams {
  getMatchColumnHeaderCell: () => Cypress.Chainable;
  getRows: () => Cypress.Chainable;
  getActionItem: (title: string) => Cypress.Chainable;
  isMatchingCell: (cellText: string) => boolean;
  rowActionTriggerSelector: string;
  deleteUrlPattern: string;
}

export enum ActionEnum {
  cancel,
  ship,
  deliver,
  sendToDistribution,
  confirmAtCenter,
  refund,
}

interface InterceptMpGuiTableParams {
  url: string;
  expectedCount?: number;
}
