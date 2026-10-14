import { injectable } from 'inversify';
import { CompanyUserSelectRepository } from '../company-user-select-repository';

@injectable()
export class B2bMpCompanyUserSelectRepository implements CompanyUserSelectRepository {
  getBusinessUnitSelect = (): Cypress.Chainable => cy.get('#company_user_account_selector_form_companyUserAccount');
  getSubmitButton = (): Cypress.Chainable =>
    cy.get('form[name=company_user_account_selector_form]').find('[type="submit"]');
  getBusinessUnitOptions = (): Cypress.Chainable =>
    cy.get('#company_user_account_selector_form_companyUserAccount option');
  // The header names only the company, so the account the selector preselects is the one acting.
  getActiveBusinessUnit = (): Cypress.Chainable =>
    cy.get('#company_user_account_selector_form_companyUserAccount option:selected');
}
