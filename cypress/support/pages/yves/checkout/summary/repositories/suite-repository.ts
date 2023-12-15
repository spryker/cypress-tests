import { Repository } from '../repository';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class SuiteRepository implements Repository {
  getaAcceptTermsAndConditionsCheckbox = (): Cypress.Chainable => {
    return cy.get('[name="acceptTermsAndConditions"]');
  };

  getSummaryForm = (): Cypress.Chainable => {
    return cy.get('form[name=summaryForm]');
  };
}
