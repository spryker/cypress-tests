import { injectable } from 'inversify';

import { CheckoutSummaryRepository } from '../checkout-summary-repository';

@injectable()
export class SuiteCheckoutSummaryRepository implements CheckoutSummaryRepository {
  // The approval widget's three actions are plain POST forms distinguished only by the path they
  // post to, and none carries a data-qa. The paths are locale-prefixed, and approve and remove
  // carry the approval's id between the segments - /DE/en/quote-approval/2/remove - so they are
  // matched on the trailing action rather than on a single contiguous substring.
  getApproverSelect = (): Cypress.Chainable => cy.get('form[action$="/quote-approval/create"]').find('select');
  getSendApprovalRequestButton = (): Cypress.Chainable =>
    cy.get('form[action$="/quote-approval/create"]').find('button[type="submit"]');
  getCancelApprovalRequestButton = (): Cypress.Chainable =>
    cy.get('form[action*="/quote-approval/"][action$="/remove"]').find('button');
  getApprovalStatus = (): Cypress.Chainable => cy.get('.quote-status');
  getaAcceptTermsAndConditionsCheckbox = (): Cypress.Chainable =>
    cy.get('[data-qa="accept-terms-and-conditions-input"]');
  getSummaryForm = (): Cypress.Chainable => cy.get('form[name=summaryForm]');
}
