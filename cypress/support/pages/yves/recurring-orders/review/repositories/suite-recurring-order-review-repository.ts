import { injectable } from 'inversify';
import { RecurringOrderReviewRepository } from '../recurring-order-review-repository';

@injectable()
export class SuiteRecurringOrderReviewRepository implements RecurringOrderReviewRepository {
  getSummaryBanner = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-summary-banner"]');
  getBackToDetailLink = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-back-link"]');
  getFooterTotal = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-footer-total"]');
  getAcceptCta = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-accept-cta"]');
  getApproveSubmitButton = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-approve-submit"]');
  getFlaggedItems = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-flagged-items"]');
  getScopeOption = (scope: string): Cypress.Chainable => cy.get(`[data-qa="recurring-order-review-scope-${scope}"]`);
}
