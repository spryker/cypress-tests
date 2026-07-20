import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { RecurringScheduleListRepository } from './recurring-schedule-list-repository';

@injectable()
@autoWired
export class RecurringScheduleListPage extends BackofficePage {
  @inject(RecurringScheduleListRepository) private repository: RecurringScheduleListRepository;

  protected PAGE_URL = '/order-experience-management/recurring-schedule';

  protected TABLE_URL = '**/order-experience-management/recurring-schedule/table**';

  waitForTable = (): void => {
    cy.intercept('GET', this.TABLE_URL).as('recurringScheduleTable');
    this.visit();
    cy.wait('@recurringScheduleTable');
  };

  searchByName = (name: string): void => {
    this.find({ searchQuery: name, interceptTableUrl: this.TABLE_URL, expectedToSeeInTable: name });
  };

  filterByStatus = (status: string): void => {
    cy.intercept('GET', this.TABLE_URL).as('filteredRecurringScheduleTable');
    cy.visitBackoffice(`${this.PAGE_URL}?recurringScheduleTableFilter[statuses][]=${status}`);
    cy.wait('@filteredRecurringScheduleTable');
  };

  openView = (idRecurringSchedule: number): void => {
    cy.get(this.repository.getViewLinkSelector(idRecurringSchedule)).click();
  };

  assertScheduleInTable = (name: string): void => {
    cy.get(this.repository.getTableBodySelector()).should('contain', name);
  };

  assertScheduleNotInTable = (name: string): void => {
    cy.get(this.repository.getTableBodySelector()).should('not.contain', name);
  };
}
