import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CompanyBusinessUnitCreateRepository {
  getCreateButton = (): Cypress.Chainable => cy.get('a[href*="business-unit/create"]');
  getNameInput = (): Cypress.Chainable => cy.get('#company_business_unit_form_name');
  getEmailInput = (): Cypress.Chainable => cy.get('#company_business_unit_form_email');
  getSubmitButton = (): Cypress.Chainable =>
    cy.get('form[name="company_business_unit_form"]').find('[data-qa="submit-button"]');
}
