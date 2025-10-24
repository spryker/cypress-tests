import { ActionEnum, AvailabilityEditPage, AvailabilityIndexPage, AvailabilityViewPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class RemoveProductStockScenario {
  @inject(AvailabilityIndexPage) private availabilityIndexPage: AvailabilityIndexPage;
  @inject(AvailabilityViewPage) private availabilityViewPage: AvailabilityViewPage;
  @inject(AvailabilityEditPage) private availabilityEditPage: AvailabilityEditPage;

  execute = (params: ExecuteParams): void => {
    this.availabilityIndexPage.visit();
    this.availabilityIndexPage.update({ query: params.abstractSku, action: ActionEnum.view });

    this.availabilityViewPage.editFirstVariant();
    this.availabilityEditPage.uncheckFirstStock();

    if (params?.shouldTriggerPublishAndSync) {
      cy.runCliCommands(['vendor/bin/console queue:worker:start --stop-when-empty']);
    }
  };
}

interface ExecuteParams {
  abstractSku: string;
  shouldTriggerPublishAndSync?: boolean;
}
