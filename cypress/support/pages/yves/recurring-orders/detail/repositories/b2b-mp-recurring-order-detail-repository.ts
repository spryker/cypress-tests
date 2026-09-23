import { injectable } from 'inversify';
import { SuiteRecurringOrderDetailRepository } from './suite-recurring-order-detail-repository';

@injectable()
export class B2bMpRecurringOrderDetailRepository extends SuiteRecurringOrderDetailRepository {
  getCancelButton = (): Cypress.Chainable => {
    return cy.get('[data-qa="recurring-order-cancel-button"]');
  };

  getHistoryViewOrderLink = (): Cypress.Chainable => cy.get('[data-qa*="recurring-order-history-view-order"]');

  getFlashAlert = (): Cypress.Chainable => cy.get('flash-message.flash-message--alert');

  getEditCadenceSelect = (): Cypress.Chainable =>
    cy.get('.main-popup--open [data-qa="recurring-order-edit-cadence-select"]').first();
}
