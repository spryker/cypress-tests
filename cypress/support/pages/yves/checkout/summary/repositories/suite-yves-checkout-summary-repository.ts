import { injectable } from 'inversify';
import 'reflect-metadata';
import { YvesCheckoutSummaryRepository } from '../yves-checkout-summary-repository';

@injectable()
export class SuiteYvesCheckoutSummaryRepository implements YvesCheckoutSummaryRepository {
  getaAcceptTermsAndConditionsCheckbox = (): Cypress.Chainable => {
    return cy.get('[name="acceptTermsAndConditions"]');
  };

  getSummaryForm = (): Cypress.Chainable => {
    return cy.get('form[name=summaryForm]');
  };
}
