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

  getListTable = (): Cypress.Chainable => this.repository.getListTable();

  clickViewSchedule = (scheduleName: string): void => {
    cy.contains('tr', scheduleName).within(() => {
      this.repository.getViewButton().click();
    });
  };

  openSchedule = (scheduleName: string): void => {
    this.visit();
    this.clickViewSchedule(scheduleName);
  };

  getRecurringOrdersAttentionBanner = (): Cypress.Chainable => {
    return this.repository.getAttentionBanner();
  };

  getActionBannerFilter = (name: string): Cypress.Chainable => {
    return this.repository.getAttentionBanner().find('a').contains(name);
  };
}
