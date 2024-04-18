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

    // skip picking is only available for suite and b2c-mp repositories
    if (params.state === 'skip picking' && !['suite', 'b2c-mp'].includes(repositoryId)) {
      return;
    }

    if (params.shouldTriggerOmsInCli) {
      cy.runCliCommands(['console oms:check-condition', 'console oms:check-timeout']);
    }

    cy.url().then((url) => {
      cy.reloadUntilFound(
        url,
        this.repository.getOmsButtonSelector(params.state),
        this.repository.getTriggerOmsDivSelector(),
        30,
        3000
      );

      cy.get(this.repository.getTriggerOmsDivSelector())
        .find(this.repository.getOmsButtonSelector(params.state))
        .click();
    });
  };

  create = (): void => {
    this.repository.getReturnButton().click();
  };
}

interface TriggerOmsParams {
  state: string;
  shouldTriggerOmsInCli?: boolean;
}
