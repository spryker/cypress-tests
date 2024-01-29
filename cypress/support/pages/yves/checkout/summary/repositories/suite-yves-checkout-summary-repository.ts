import { injectable } from 'inversify';
import 'reflect-metadata';
import { YvesCheckoutSummaryRepository } from '../yves-checkout-summary-repository';

@injectable()
export class SuiteYvesCheckoutSummaryRepository implements YvesCheckoutSummaryRepository {
  getaAcceptTermsAndConditionsCheckbox = (): Cypress.Chainable => cy.get('[name="acceptTermsAndConditions"]');
  getSummaryForm = (): Cypress.Chainable => cy.get('form[name=summaryForm]');
}
