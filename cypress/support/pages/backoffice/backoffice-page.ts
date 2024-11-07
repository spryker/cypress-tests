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
            let button = this.getEditButtonFromRow($row);

            button = button.length ? button : null;

            if (button === null) {
                cy.log('Record is asigned to the store or not found by search criteria')
            }

            return button;
        });
    };

    public find = (params: UpdateParams): Cypress.Chainable => {
        cy.get('[type="search"]').invoke('val', '').type(params.searchQuery);

        return this.interceptTable(
            { url: params.tableUrl, expectedCount: params.expectedCount },
            () => {
                let rows = cy.get('tbody > tr:visible');

                if (params.rowFilter && params.rowFilter.length > 0) {
                    params.rowFilter.forEach(filterFn => {
                        if (rows.length) {
                            rows = rows.filter((index, row) => filterFn(Cypress.$(row)));
                        }
                    });
                }
                return rows.first();
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
