import { injectable } from 'inversify';

import { CheckoutSummaryRepository } from '../checkout-summary-repository';

@injectable()
export class B2bCheckoutSummaryRepository implements CheckoutSummaryRepository {
  getaAcceptTermsAndConditionsCheckbox = (): Cypress.Chainable =>
    cy.get('[data-qa="accept-terms-and-conditions-input"]');
  getSummaryForm = (): Cypress.Chainable => cy.get('form[name=summaryForm]');
}
