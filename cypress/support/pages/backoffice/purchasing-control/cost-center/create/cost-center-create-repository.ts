import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CostCenterCreateRepository {
  getNameInput = (): Cypress.Chainable => cy.get('#costCenterForm_name');
  getDescriptionTextarea = (): Cypress.Chainable => cy.get('#costCenterForm_description');
  getCompanySelect = (): Cypress.Chainable => cy.get('#costCenterForm_idCompany');
  getBusinessUnitSelect = (): Cypress.Chainable => cy.get('#costCenterForm_companyBusinessUnitIds');
  getIsActiveCheckbox = (): Cypress.Chainable => cy.get('#costCenterForm_isActive');
  getSaveButton = (): Cypress.Chainable => cy.get('button[type="submit"]:contains("Save")');
  getSuccessMessage = (): Cypress.Chainable => cy.get('.alert-success');
}
