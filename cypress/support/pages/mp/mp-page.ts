import { injectable } from 'inversify';

import { AbstractPage } from '../abstract-page';
import VisitOptions = Cypress.VisitOptions;

@injectable()
export class MpPage extends AbstractPage {
  visit = (options?: Partial<VisitOptions>): void => {
    cy.visitMerchantPortal(this.PAGE_URL, options);
  };

  protected interceptTable = (params: InterceptMpGuiTableParams, customFunction?: () => void): void => {
    const expectedCount = params.expectedCount ?? 1;
    const interceptAlias = this.faker.string.uuid();

    cy.intercept('GET', params.url).as(interceptAlias);

    if (customFunction) {
      customFunction();
    }

    cy.wait(`@${interceptAlias}`, {timeout: 10000})
      .its('response.body.total')
      .should((total: number) => {
        const valueToBeAtMost = expectedCount + Cypress.currentRetry;
        assert.isTrue(total === expectedCount || total >= valueToBeAtMost);
      });
  };
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
