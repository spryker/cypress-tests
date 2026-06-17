import { injectable } from 'inversify';
import { RecurringOrderDetailRepository } from '../recurring-order-detail-repository';

@injectable()
export class SuiteRecurringOrderDetailRepository implements RecurringOrderDetailRepository {
  getScheduleName = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-name"]');
  getCadence = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-cadence"]');
  getStatusBadge = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-status-badge"]');
  getPauseButton = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-pause-button"]');
  getResumeButton = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-resume-button"]');
  getCancelButton = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-cancel-button"]');
  getSkipButton = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-skip-button"]');
  getReviewButton = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-button"]');
  getSkipConfirmButton = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-skip-confirm-button"]');
  getCancelConfirmButton = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-cancel-confirm-button"]');
  getPauseConfirmButton = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-pause-confirm-button"]');
  getResumeConfirmButton = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-resume-confirm-button"]');
  getResumeDateInput = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-resume-date-input"]');
  getHistoryViewOrderLink = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-history-view-order"]');
}
