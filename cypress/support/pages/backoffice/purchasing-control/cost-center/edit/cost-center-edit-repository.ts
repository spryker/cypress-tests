import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CostCenterEditRepository {
  getNameInput = (): Cypress.Chainable => cy.get('[data-qa="cost-center-name"]');
  getDescriptionTextarea = (): Cypress.Chainable => cy.get('[data-qa="cost-center-description"]');
  getCompanySelect = (): Cypress.Chainable => cy.get('[data-qa="cost-center-company"]');
  getBusinessUnitSelect = (): Cypress.Chainable => cy.get('[data-qa="cost-center-business-unit-ids"]');
  getIsActiveCheckbox = (): Cypress.Chainable => cy.get('[data-qa="cost-center-is-active"]');
  getSaveButton = (): Cypress.Chainable => cy.get('[data-qa="submit-button"]');
  getSuccessMessage = (): Cypress.Chainable => cy.get('.alert-success');
}
