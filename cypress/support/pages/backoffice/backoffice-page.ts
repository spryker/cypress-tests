import { injectable } from 'inversify';
import { AbstractPage } from '../abstract-page';
import VisitOptions = Cypress.VisitOptions;
import Chainable = Cypress.Chainable;

@injectable()
export class BackofficePage extends AbstractPage {
  visit = (options?: Partial<VisitOptions>): void => {
    cy.visitBackoffice(this.PAGE_URL, options);
  };

  public interceptTable = (params: InterceptGuiTableParams, callback?: () => void): Chainable => {
    const expectedCount = params.expectedCount ?? 1;
    const interceptAlias = this.faker.string.uuid();

    cy.intercept('GET', params.url).as(interceptAlias);
    return cy
      .wait(`@${interceptAlias}`, { timeout: 10000 })
      .its('response.body')
      .should((total) => {
        if (params.expectedCount !== null) {
          const valueToBeAtMost = expectedCount + Cypress.currentRetry;
          console.log('Total:', total.recordsFiltered, 'Expected:', expectedCount, 'Value to be at most:', valueToBeAtMost, 'Data:', total.data);
          assert.isTrue(total.recordsFiltered === expectedCount || total.recordsFiltered >= valueToBeAtMost);
        }
      })
      .then(() => {
        if (callback) {
          return callback();
        }
      });
  };

  public find = (params: UpdateParams): Cypress.Chainable => {
    const getRows = (): Cypress.Chainable<JQuery<HTMLElement>> => {
      if (params.expectedCount !== undefined) {
        return cy.get('tbody > tr:visible').should('have.length', params.expectedCount);
      }

      return cy.get('tbody > tr:visible');
    };

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    return cy
      .get('input[type="search"][data-qa="table-search"]')
      .clear()
      .invoke('val', params.searchQuery)
      .trigger('input')
      .then(() => {
        return this.interceptTable({ url: params.tableUrl, expectedCount: params.expectedCount }, () => {
          return getRows().then(($rows) => {
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
            } else {
              cy.log('No rows found after filtering');
              return null;
            }
          });
        });
      });
  };

  public findWithRetry = (params: UpdateWithRetryParams): Cypress.Chainable => {
    const retryCount = 2;
    let attempts = 0;

    const searchAndIntercept = (): Cypress.Chainable => {
      attempts++;
      // eslint-disable-next-line cypress/unsafe-to-chain-command
      cy.get('input[type="search"][data-qa="table-search"]')
        .clear()
        .then(() => {
          cy.visitBackoffice(params.pageUrl);
        });

      return this.interceptTable({ url: params.tableUrl }).then(() => {
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.get('input[type="search"][data-qa="table-search"]')
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
  tableUrl: string;
  rowFilter?: Array<(row: JQuery<HTMLElement>) => boolean>;
  expectedCount?: number;
}

interface UpdateWithRetryParams {
  searchQuery: string;
  tableUrl: string;
  rowFilter?: Array<(row: JQuery<HTMLElement>) => boolean>;
  expectedCount?: number | null;
  pageUrl: string;
}
