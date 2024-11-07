import { injectable } from 'inversify';
import { AbstractPage } from '../abstract-page';
import VisitOptions = Cypress.VisitOptions;

@injectable()
export class BackofficePage extends AbstractPage {
  visit = (options?: Partial<VisitOptions>): void => {
    cy.visitBackoffice(this.PAGE_URL, options);
  };

    public interceptTable = (params: InterceptGuiTableParams, callback?: () => void) => {
        const expectedCount = params.expectedCount ?? 1;
        const interceptAlias = this.faker.string.uuid();

        cy.intercept('GET', params.url).as(interceptAlias);
        return cy.wait(`@${interceptAlias}`)
            .its('response.body.recordsFiltered')
            .should((total) => {
                const valueToBeAtMost = expectedCount + Cypress.currentRetry;
                assert.isTrue(total === expectedCount || total >= valueToBeAtMost);
            })
            .then(() => {
                if (callback) {
                    return callback();
                }
            });
    };

    public getEditButton = (params: UpdateParams): Cypress.Chainable => {
        return this.find(params).then(($row) => {
            if (!$row) {
                cy.log('No rows found after filtering');
                return null;
            }
            return this.getEditButtonFromRow($row).then(($button) => {
                if ($button.length) {
                    return $button;
                } else {
                    cy.log('Record is assigned to the store or not found by search criteria');
                    return null;
                }
            });
        });
    };

    public find = (params: UpdateParams): Cypress.Chainable => {
        cy.get('[type="search"]').invoke('val', params.searchQuery).trigger('input');

        return this.interceptTable(
            { url: params.tableUrl, expectedCount: params.expectedCount },
            () => {
                cy.get('tbody > tr:visible').then(($rows) => {
                    let rows = Cypress.$($rows);

                    if (params.rowFilter && params.rowFilter.length > 0) {
                        params.rowFilter.forEach(filterFn => {
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
            }
        );
    };

    private getEditButtonFromRow = ($row: JQuery<HTMLElement>): Cypress.Chainable => {
        return cy.wrap($row).find('a:contains("Edit")');
    };
}

export enum ActionEnum {
    view,
    edit,
    activate,
    deactivate,
    approveAccess,
    denyAccess,
    delete,
    publish,
}

interface InterceptGuiTableParams {
    url: string;
    expectedCount?: number;
}

interface UpdateParams {
    searchQuery: string;
    tableUrl: string;
    rowFilter?: Array<(row: JQuery<HTMLElement>) => boolean>;
    expectedCount?: number;
}
