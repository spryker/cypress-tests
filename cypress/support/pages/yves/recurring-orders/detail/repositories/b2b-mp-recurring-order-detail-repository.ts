import { injectable } from 'inversify';
import { SuiteRecurringOrderDetailRepository } from './suite-recurring-order-detail-repository';

@injectable()
export class B2bMpRecurringOrderDetailRepository extends SuiteRecurringOrderDetailRepository {
  getCancelButton = (): Cypress.Chainable => {
    return cy.get('[data-qa="recurring-order-cancel-button"]');
  };

  getHistoryViewOrderLink = (): Cypress.Chainable => cy.get('[data-qa*="recurring-order-history-view-order"]');
}
