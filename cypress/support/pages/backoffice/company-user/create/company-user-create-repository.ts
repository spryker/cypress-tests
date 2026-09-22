import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CompanyUserCreateRepository {
  getEmailInput = (): Cypress.Chainable => cy.get('#company-user_customer_email');
  getSalutationSelect = (): Cypress.Chainable => cy.get('#company-user_customer_salutation');
  getFirstNameInput = (): Cypress.Chainable => cy.get('#company-user_customer_first_name');
  getLastNameInput = (): Cypress.Chainable => cy.get('#company-user_customer_last_name');
  getGenderSelect = (): Cypress.Chainable => cy.get('#company-user_customer_gender');
  getCompanySelect = (): Cypress.Chainable => cy.get('select#company-user_fk_company');
  getBusinessUnitSelect = (): Cypress.Chainable => cy.get('select#company-user_fk_company_business_unit');
  getSubmitButton = (): Cypress.Chainable => cy.get('input[type="submit"].safe-submit');

  // Each role is labelled "<name> (id: <id>)", so the label text is the only handle a spec can predict.
  getRoleCheckbox = (roleName: string): Cypress.Chainable =>
    cy.contains('#company-user_company_role_collection label', roleName).find('input[type="checkbox"]');
}
