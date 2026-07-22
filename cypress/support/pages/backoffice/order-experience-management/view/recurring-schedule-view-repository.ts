import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class RecurringScheduleViewRepository {
  getName = (): Cypress.Chainable => cy.get('[data-qa="recurring-schedule-view-name"]');
  getStatus = (): Cypress.Chainable => cy.get('[data-qa="recurring-schedule-view-status"]');
  getFrequency = (): Cypress.Chainable => cy.get('[data-qa="recurring-schedule-view-frequency"]');
  getItems = (): Cypress.Chainable => cy.get('[data-qa="recurring-schedule-view-items"]');
}
