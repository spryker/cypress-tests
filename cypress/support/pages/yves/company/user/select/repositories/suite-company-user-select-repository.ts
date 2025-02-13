import { injectable } from 'inversify';
import { CompanyUserSelectRepository } from '../company-user-select-repository';

@injectable()
export class SuiteCompanyUserSelectRepository implements CompanyUserSelectRepository {
  getBusinessUnitSelect = (): Cypress.Chainable => cy.get('#company_user_account_selector_form_companyUserAccount');
  getSubmitButton = (): Cypress.Chainable =>
    cy.get('form[name=company_user_account_selector_form]').find('[type="submit"]');
    getTopUserEnableButton = (): Cypress.Chainable =>
        cy.get('body').find('.role-user-table tr:first-child a:contains("Disable")');
    getTopUserDisableButton = (): Cypress.Chainable =>
        cy.get('body').find('.role-user-table tr:first-child a:contains("Disable")');
}
