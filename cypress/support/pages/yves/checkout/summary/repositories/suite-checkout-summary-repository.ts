import { injectable } from 'inversify';
import 'reflect-metadata';
import { CheckoutSummaryRepository } from '../checkout-summary-repository';

@injectable()
export class SuiteCheckoutSummaryRepository implements CheckoutSummaryRepository {
  getaAcceptTermsAndConditionsCheckbox = (): Cypress.Chainable => cy.get('[name="acceptTermsAndConditions"]');
  getSummaryForm = (): Cypress.Chainable => cy.get('form[name=summaryForm]');
}
