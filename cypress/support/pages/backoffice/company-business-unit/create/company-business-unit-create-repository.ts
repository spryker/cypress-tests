import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CompanyBusinessUnitCreateRepository {
  getCompanySelect = (): Cypress.Chainable => cy.get('#company-business-unit_fk_company');
  getNameInput = (): Cypress.Chainable => cy.get('#company-business-unit_name');
  getSubmitButton = (): Cypress.Chainable => cy.get('input[type="submit"].safe-submit');
}
