import { injectable } from 'inversify';

import { AbstractPage } from '../abstract-page';
import VisitOptions = Cypress.VisitOptions;

@injectable()
export class MpPage extends AbstractPage {
  visit = (options?: Partial<VisitOptions>): void => {
    cy.visitMerchantPortal(this.PAGE_URL, options);
  };

  protected interceptTable = (params: InterceptMpGuiTableParams): void => {
    const expectedCount = params.expectedCount ?? 1;
    const interceptAlias = this.faker.string.uuid();

    cy.intercept('GET', params.url).as(interceptAlias);
    cy.wait(`@${interceptAlias}`)
      .its('response.body.total')
      .should((total) => {
        const valueToBeAtMost = expectedCount + Cypress.currentRetry;
        assert.isAtMost(total, valueToBeAtMost);
      });
  };
}

interface InterceptMpGuiTableParams {
  url: string;
  expectedCount?: number;
}
