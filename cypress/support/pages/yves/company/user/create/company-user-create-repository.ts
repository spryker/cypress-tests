import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CompanyUserCreateRepository {
  getCreateButton = (): Cypress.Chainable => cy.get('a[href*="company/user/create"]');
  getBusinessUnitSelect = (): Cypress.Chainable => cy.get('select[id*="company_business_unit"]');
  getEmailInput = (): Cypress.Chainable => cy.get('#company_user_form_email');
  getFirstNameInput = (): Cypress.Chainable => cy.get('#company_user_form_first_name');
  getLastNameInput = (): Cypress.Chainable => cy.get('#company_user_form_last_name');
  getSubmitButton = (): Cypress.Chainable => cy.get('form[name="company_user_form"]').find('[data-qa="submit-button"]');

  // The roles render as checkboxes whose label carries the role name, so the label is the handle.
  getRoleCheckboxLabel = (roleName: string): Cypress.Chainable =>
    cy.contains('label', roleName).find('input[id*="company_role_collection"]');
}
