import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '../../backoffice-page';
import { SalesDetailRepository } from './sales-detail-repository';

@injectable()
@autoWired
export class SalesDetailPage extends BackofficePage {
  protected PAGE_URL = '/sales/detail';

  @inject(SalesDetailRepository) private repository: SalesDetailRepository;

  triggerOms = (state: string, shouldTriggerOmsInCli = false): void => {
    if (shouldTriggerOmsInCli) {
      cy.runCliCommands(['console oms:check-condition', 'console oms:check-timeout']);
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

  createReturn = (): void => {
    this.repository.getReturnButton().click();
  };
}
