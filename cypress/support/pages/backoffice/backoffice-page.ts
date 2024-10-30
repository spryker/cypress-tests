import { injectable } from 'inversify';

import { AbstractPage } from '../abstract-page';
import VisitOptions = Cypress.VisitOptions;

@injectable()
export class BackofficePage extends AbstractPage {
  visit = (options?: Partial<VisitOptions>): void => {
    cy.visitBackoffice(this.PAGE_URL, options);
  };

  public interceptTable = (params: InterceptGuiTableParams): void => {
    const expectedCount = params.expectedCount ?? 1;
    const interceptAlias = this.faker.string.uuid();

    cy.intercept('GET', params.url).as(interceptAlias);
    cy.wait(`@${interceptAlias}`)
      .its('response.body.recordsFiltered')
      .should((total) => {
        const valueToBeAtMost = expectedCount + Cypress.currentRetry;
        assert.isTrue(total === expectedCount || total >= valueToBeAtMost);
      });
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
