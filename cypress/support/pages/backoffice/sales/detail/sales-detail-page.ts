import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SalesDetailRepository } from './sales-detail-repository';

@injectable()
@autoWired
export class SalesDetailPage extends BackofficePage {
  @inject(SalesDetailRepository) private repository: SalesDetailRepository;

  protected PAGE_URL = '/sales/detail';

  triggerOms = (params: TriggerOmsParams): void => {
    const repositoryId = Cypress.env('repositoryId');

    // skip picking is only available for suite, b2c and b2c-mp repositories
    if (params.state === 'skip picking' && !['suite', 'b2c', 'b2c-mp'].includes(repositoryId)) {
      return;
    }

    if (params.shouldTriggerOmsInCli) {
      cy.runCliCommands(['console oms:check-condition', 'console oms:check-timeout']);
    }

    cy.url().then((url) => {
      // a workaround for running tests on envs with basic auth (e.g. smoke tests on SE envs)
      // because basic auth should be included into the url but the current url returned by cy.url() does not have basic auth credentials
      const currentUrl = new URL(url);
      const targetUrl = new URL(Cypress.env('backofficeUrl'));

      targetUrl.pathname = currentUrl.pathname;
      targetUrl.search = currentUrl.search;
      const normalizedUrl = targetUrl.toString();

      cy.reloadUntilFound(
        normalizedUrl,
        this.repository.getOmsButtonSelector(params.state),
        this.repository.getTriggerOmsDivSelector(),
        25,
        5000,
        params.shouldTriggerOmsInCli ? ['console oms:check-condition', 'console oms:check-timeout'] : []
      );

      cy.get(this.repository.getTriggerOmsDivSelector())
        .find(this.repository.getOmsButtonSelector(params.state))
        .click();
    });
  };

  create = (): void => {
    this.repository.getReturnButton().click();
  };

  getTotalCommissionBlock = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.contains('Total Commission').parent().parent().parent();
  };

  getTotalRefundedCommissionBlock = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.contains('Total Refunded Commission').parent().parent().parent();
  };
}

interface TriggerOmsParams {
  state: string;
  shouldTriggerOmsInCli?: boolean;
}
