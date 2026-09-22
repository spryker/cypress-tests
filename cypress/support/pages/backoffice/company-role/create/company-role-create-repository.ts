import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CompanyRoleCreateRepository {
  getCompanyRoleCreateForm = (): Cypress.Chainable => cy.get('form[name=company_role_create_form]');
  getCompanySelect = (): Cypress.Chainable => cy.get('#company_role_create_form_fkCompany');
  getNameInput = (): Cypress.Chainable => cy.get('#company_role_create_form_name');
  getSubmitButton = (): Cypress.Chainable => cy.get('input[type="submit"].safe-submit');

  // Permissions render as checkboxes labelled with their translated name, e.g. "View company users".
  getPermissionCheckbox = (permissionName: string): Cypress.Chainable =>
    cy.contains('#company-role_permission_collection label', permissionName).find('input[type="checkbox"]');
}
