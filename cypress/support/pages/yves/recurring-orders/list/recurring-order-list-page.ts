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

  assertListTableVisible = (): void => {
    this.repository.getListTable().should('be.visible');
  };

  assertScheduleVisible = (scheduleName: string): void => {
    this.repository.getListTable().contains(scheduleName).should('be.visible');
  };

  assertScheduleRowContains = (scheduleName: string, text: string): void => {
    this.repository
      .getListTable()
      .contains('tr', scheduleName)
      .invoke('text')
      .invoke('toLowerCase')
      .should('contain', text.toLowerCase());
  };

  assertScheduleListDoesNotContainScheduleWithStatus = (status: string): void => {
    this.repository.getListTable().invoke('text').invoke('toLowerCase').should('not.contain', status.toLowerCase());
  };

  assertEmptyState = (): void => {
    this.repository.getListTable().should('be.visible');
  };

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
