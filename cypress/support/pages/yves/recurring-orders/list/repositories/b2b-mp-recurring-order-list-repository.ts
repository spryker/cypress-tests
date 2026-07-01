import { injectable } from 'inversify';
import { RecurringOrderListRepository } from '../recurring-order-list-repository';

@injectable()
export class B2bMpRecurringOrderListRepository implements RecurringOrderListRepository {
  getViewButton = (): Cypress.Chainable => cy.get('[data-qa*="recurring-order-view-button"]');
  getListTable = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-list-table"]');
  getAttentionBanner = (): Cypress.Chainable => cy.get('[data-qa*="recurring-order-attention-banner"]');
}
