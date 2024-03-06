import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { CliHelper } from '../../../../helpers/cli-helper';
import { BackofficePage } from '../../backoffice-page';
import { SalesDetailRepository } from './sales-detail-repository';

@injectable()
@autoWired
export class SalesDetailPage extends BackofficePage {
  protected PAGE_URL: string = '/sales/detail';

  constructor(
    @inject(SalesDetailRepository) private repository: SalesDetailRepository,
    @inject(CliHelper) private cliHelper: CliHelper
  ) {
    super();
  }

  public triggerOms = (state: string, shouldTriggerOmsInCli: boolean = false): void => {
    if (shouldTriggerOmsInCli) {
      this.cliHelper.run(['console oms:check-condition', 'console oms:check-timeout']);
    }

    cy.url().then((url) => {
      cy.reloadUntilFound(
        url,
        this.repository.getOmsButtonSelector(state),
        this.repository.getTriggerOmsDivSelector(),
        30,
        500
      );

      cy.get(this.repository.getTriggerOmsDivSelector()).find(this.repository.getOmsButtonSelector(state)).click();
    });
  };

  public createReturn = (): void => {
    this.repository.getReturnButton().click();
  };
}
