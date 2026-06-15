import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { RecurringOrderListRepository } from './recurring-order-list-repository';

@injectable()
@autoWired
export class RecurringOrderListPage extends YvesPage {
  @inject(REPOSITORIES.YvesRecurringOrderListRepository)
  private repository: RecurringOrderListRepository;

  protected PAGE_URL = '/recurring-orders';

  assertScheduleVisible = (scheduleName: string): void => {
    cy.contains(scheduleName).should('be.visible');
  };

  assertEmptyState = (): void => {
    this.repository.getListTable().should('be.visible');
  };

  clickViewSchedule = (scheduleName: string): void => {
    cy.contains('tr', scheduleName).within(() => {
      this.repository.getViewButton().click();
    });
  };
}
