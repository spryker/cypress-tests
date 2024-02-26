import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { SalesDetailRepository } from './sales-detail-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';
import { CliHelper } from '../../../../helpers/cli-helper';
import { BackofficePage } from '../../backoffice-page';

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
      this.cliHelper.run('console oms:check-condition');
      this.cliHelper.run('console oms:check-timeout');
    }

    cy.url().then((url) => {
      cy.reloadUntilFound(
        url,
        this.repository.getOmsButtonSelector(state),
        this.repository.getTriggerOmsDivSelector(),
        30,
        2000
      );

      cy.get(this.repository.getTriggerOmsDivSelector()).find(this.repository.getOmsButtonSelector(state)).click();
    });
  };

  public createReturn = (): void => {
    this.repository.getReturnButton().click();
  };
}
