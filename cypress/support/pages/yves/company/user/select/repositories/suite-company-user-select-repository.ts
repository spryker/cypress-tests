import { injectable } from 'inversify';
import { CompanyUserSelectRepository } from '../company-user-select-repository';

@injectable()
export class SuiteCompanyUserSelectRepository implements CompanyUserSelectRepository {
  getBusinessUnitSelect = (): Cypress.Chainable => cy.get('#company_user_account_selector_form_companyUserAccount');
  getSubmitButton = (): Cypress.Chainable =>
    cy.get('form[name=company_user_account_selector_form]').find('[type="submit"]');
  getBusinessUnitOptions = (): Cypress.Chainable =>
    cy.get('#company_user_account_selector_form_companyUserAccount option');
  // The top navigation names the business unit the customer is currently acting for.
  getActiveBusinessUnitLink = (): Cypress.Chainable =>
    cy.get('[data-qa="component navigation-top"] a[href*="/company/user/select"]');
}
