import { injectable } from 'inversify';
import { AbstractPage } from '../abstract-page';
import VisitOptions = Cypress.VisitOptions;
import Chainable = Cypress.Chainable;

@injectable()
export class BackofficePage extends AbstractPage {
  private static readonly PRODUCT_TABLE_COL_ID = 0;

  private static readonly PRODUCT_TABLE_COL_SKU = 2;

  visit = (options?: Partial<VisitOptions>): void => {
    cy.visitBackoffice(this.PAGE_URL, options);
  };

  clearSessionCookie = (): void => {
    cy.clearCookie(Cypress.env('backofficeSessionCookieName'));
  };

  getBackofficeAbsoluteUrl = (path: string): string => `${Cypress.env('backofficeUrl')}${path}`;

  /**
   * Resolves a product abstract's numeric id from its SKU.
   *
   * `id_product_abstract` is an auto-increment value assigned during data import, so it is NOT
   * stable across environments: the same demo CSV yields different ids on a freshly seeded CI
   * database than on a locally reused one. Specs must therefore address products by SKU (stable,
   * authored in the CSV) and resolve the id at runtime rather than hard-coding the pairing.
   */
  resolveProductAbstractIdBySku = (sku: string): Cypress.Chainable<number> =>
    cy
      .request({
        url: this.getBackofficeAbsoluteUrl(
          `/product-management/index/table?length=25&search[value]=${encodeURIComponent(sku)}`
        ),
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((response) => {
        const rows: Array<Array<string>> = response.body.data ?? [];
        // Column order comes from ProductTable::configure(): [id_product_abstract, name, sku, ...].
        const row = rows.find((columns) => columns[BackofficePage.PRODUCT_TABLE_COL_SKU] === sku);

        expect(row, `product abstract table row for SKU "${sku}"`).to.not.be.undefined;

        return Number((row as Array<string>)[BackofficePage.PRODUCT_TABLE_COL_ID].replace(/\D/g, ''));
      });

  public interceptTable = (params: InterceptGuiTableParams, callback?: () => void): Chainable => {
    const expectedCount = params.expectedCount ?? 1;
    const interceptAlias = this.faker.string.uuid();

    cy.intercept('GET', params.url).as(interceptAlias);
    // eslint-disable-next-line spryker-cypress/no-assertions-in-page-objects -- Internal retry/settle guard on the GUI-table intercept; not a spec-level assertion.
    return cy
      .wait(`@${interceptAlias}`, { timeout: 10000 })
      .its('response.body')
      .should((total) => {
        if (params.expectedCount !== undefined && params.expectedCount !== null) {
          const valueToBeAtMost = expectedCount + Cypress.currentRetry;
          console.log(
            'Total:',
            total.recordsFiltered,
            'Expected:',
            expectedCount,
            'Value to be at most:',
            valueToBeAtMost,
            'Data:',
            total.data
          );
          assert.isTrue(
            total.recordsFiltered === expectedCount || total.recordsFiltered >= valueToBeAtMost,
            `Expected recordsFiltered to equal ${expectedCount} or be at least ${valueToBeAtMost}, but got ${total.recordsFiltered}`
          );
        }
      })
      .then(() => {
        if (callback) {
          return callback();
        }
      });
  };

  protected getRows = (expectedCount?: number): Cypress.Chainable<JQuery<HTMLElement>> => {
    if (expectedCount !== undefined) {
      // eslint-disable-next-line spryker-cypress/no-assertions-in-page-objects -- Retry-settles the visible row count; internal table helper, not a spec assertion.
      return cy.get('tbody > tr:visible').should('have.length', expectedCount);
    }

    return cy.get('tbody > tr:visible');
  };

  public find = (params: UpdateParams): Cypress.Chainable<TableRowGetter | null> => {
    const expectedCount = params.expectedCount ?? 1;
    const clearInterceptAlias = this.faker.string.uuid();
    const searchInterceptAlias = this.faker.string.uuid();

    cy.intercept('GET', params.interceptTableUrl, (req) => {
      const searchValue = req.query['search[value]'];

      if (searchValue === '' || searchValue === undefined) {
        req.alias = clearInterceptAlias;
      }
    });

    cy.intercept('GET', params.interceptTableUrl, (req) => {
      const searchValue = req.query['search[value]'];

      if (searchValue === params.searchQuery) {
        req.alias = searchInterceptAlias;
      }
    });

    return (
      // eslint-disable-next-line cypress/unsafe-to-chain-command
      cy
        .get('input[type="search"][data-qa="table-search"]', { timeout: 10000 })
        .then(($input) => {
          const currentValue = $input.val() as string;
          const hasValue = currentValue && currentValue.trim().length > 0;

          cy.wrap($input).clear();

          if (hasValue) {
            return cy.wait(`@${clearInterceptAlias}`, { timeout: 10000 });
          } else {
            return cy.wrap(null);
          }
        })
        .then(() => {
          // eslint-disable-next-line cypress/unsafe-to-chain-command
          return cy
            .get('input[type="search"][data-qa="table-search"]', { timeout: 100 })
            .invoke('val', params.searchQuery)
            .trigger('input')
            .then(() => {
              return cy
                .wait(`@${searchInterceptAlias}`, { timeout: 10000 })
                .its('response.body')
                .should((total) => {
                  if (params.expectedCount !== null && params.expectedCount !== undefined) {
                    const valueToBeAtMost = expectedCount + Cypress.currentRetry;
                    assert.isTrue(total.recordsFiltered === expectedCount || total.recordsFiltered >= valueToBeAtMost);
                  }
                })
                .then(() => {
                  cy.get('.spy-spinner, .data-processing, .loading').should('not.exist');

                  if (params.expectedToSeeInTable) {
                    cy.get('tbody').should('contain', params.expectedToSeeInTable);
                  }
                })
                .then(() => {
                  return this.getRows(params.expectedCount).then(($rows) => {
                    let rows = Cypress.$($rows);

                    if (params.rowFilter && params.rowFilter.length > 0) {
                      params.rowFilter.forEach((filterFn) => {
                        if (rows.length > 0) {
                          rows = rows.filter((index, row) => filterFn(Cypress.$(row)));
                        }
                      });
                    }

                    if (rows.length > 0) {
                      const rowIndex = Array.from($rows).indexOf(rows.first()[0]);
                      const getRow: TableRowGetter = () => cy.get('tbody > tr:visible').eq(rowIndex);

                      return getRow;
                    } else {
                      cy.log('No rows found after filtering');

                      return null;
                    }
                  });
                });
            });
        }) as unknown as Cypress.Chainable<TableRowGetter | null>
    );
  };

  public findWithRetry = (params: UpdateWithRetryParams): Cypress.Chainable => {
    const retryCount = 2;
    let attempts = 0;

    const searchAndIntercept = (): Cypress.Chainable => {
      attempts++;
      // eslint-disable-next-line cypress/unsafe-to-chain-command
      cy.get('input[type="search"][data-qa="table-search"]', { timeout: 10000 })
        .clear()
        .then(() => {
          cy.visitBackoffice(params.pageUrl);
        });

      return this.interceptTable({ url: params.tableUrl }).then(() => {
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.get('input[type="search"][data-qa="table-search"]', { timeout: 10000 })
          .invoke('val', params.searchQuery)
          .trigger('input')
          .then(() => {
            return this.interceptTable({ url: params.tableUrl, expectedCount: params.expectedCount }, () => {
              cy.get('tbody > tr:visible').then(($rows) => {
                let rows = Cypress.$($rows);

                if (params.rowFilter && params.rowFilter.length > 0) {
                  params.rowFilter.forEach((filterFn) => {
                    if (rows.length > 0) {
                      rows = rows.filter((index, row) => filterFn(Cypress.$(row)));
                    }
                  });
                }

                if (rows.length > 0) {
                  return cy.wrap(rows.first());
                } else if (attempts < retryCount) {
                  cy.log(`Retrying... Attempt ${attempts}`);
                  return searchAndIntercept();
                } else {
                  cy.log('No rows found after filtering');
                  return null;
                }
              });
            });
          });
      });
    };

    return searchAndIntercept();
  };
}

export type TableRowGetter = () => Cypress.Chainable<JQuery<HTMLElement>>;

export enum ActionEnum {
  view,
  edit,
  activate,
  approve,
  deactivate,
  approveAccess,
  denyAccess,
  delete,
  deny,
  removeMultiFactorAuthentication,
}

interface InterceptGuiTableParams {
  url: string;
  expectedCount?: number | null;
}

interface UpdateParams {
  searchQuery: string;
  interceptTableUrl: string;
  rowFilter?: Array<(row: JQuery<HTMLElement>) => boolean>;
  expectedCount?: number;
  expectedToSeeInTable?: string;
}

interface UpdateWithRetryParams {
  searchQuery: string;
  tableUrl: string;
  rowFilter?: Array<(row: JQuery<HTMLElement>) => boolean>;
  expectedCount?: number | null;
  pageUrl: string;
}
