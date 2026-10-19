import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CompanyCreateRepository {
  getNameInput = (): Cypress.Chainable => cy.get('#company_name');
  getSubmitButton = (): Cypress.Chainable => cy.get('input[type="submit"].safe-submit');
}
