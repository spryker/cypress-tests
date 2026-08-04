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

  getName = (): Cypress.Chainable => this.repository.getName();

  getStatus = (): Cypress.Chainable => this.repository.getStatus();

  getItems = (): Cypress.Chainable => this.repository.getItems();

  getConfigurableBundleLabels = (): Cypress.Chainable => this.repository.getConfigurableBundleLabels();
}
