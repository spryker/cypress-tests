import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { RecurringScheduleViewRepository } from './recurring-schedule-view-repository';

@injectable()
@autoWired
export class RecurringScheduleViewPage extends BackofficePage {
  @inject(RecurringScheduleViewRepository) private repository: RecurringScheduleViewRepository;

  protected PAGE_URL = '/order-experience-management/recurring-schedule/view';

  visitById = (idRecurringSchedule: number): void => {
    cy.visitBackoffice(`${this.PAGE_URL}?id-recurring-schedule=${idRecurringSchedule}`);
  };

  assertName = (name: string): void => {
    this.repository.getName().should('contain', name);
  };

  assertStatus = (status: string): void => {
    this.repository.getStatus().should('contain', status);
  };

  assertItemsContain = (text: string): void => {
    this.repository.getItems().should('contain', text);
  };
}
