import { injectable } from 'inversify';
import { CompanyUserSelectRepository } from '../company-user-select-repository';

@injectable()
export class B2bMpCompanyUserSelectRepository implements CompanyUserSelectRepository {
  getBusinessUnitSelect = (): Cypress.Chainable => cy.get('#company_user_account_selector_form_companyUserAccount');
  getSubmitButton = (): Cypress.Chainable =>
    cy.get('form[name=company_user_account_selector_form]').find('[type="submit"]');
}
