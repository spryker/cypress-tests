import { injectable } from 'inversify';
import { CheckoutSummaryRecurringOrderRepository } from '../checkout-summary-recurring-order-repository';

@injectable()
export class SuiteCheckoutSummaryRecurringOrderRepository implements CheckoutSummaryRecurringOrderRepository {
  getRecurringOrderToggle = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-toggle"]');
  getScheduleNameInput = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-schedule-name-input"]');
  getCadenceTypeSelect = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-cadence-type-select"]');
  getCadenceValueInput = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-cadence-value-input"]');
  getStartDateInput = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-start-date-input"]');
  getConfirmButton = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-confirm-button"]');
}
