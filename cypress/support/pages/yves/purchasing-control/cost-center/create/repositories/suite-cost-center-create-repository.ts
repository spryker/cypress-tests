import { injectable } from 'inversify';
import { CostCenterCreateRepository } from '../cost-center-create-repository';

@injectable()
export class SuiteCostCenterCreateRepository implements CostCenterCreateRepository {
  getNameInput = (): Cypress.Chainable => cy.get('#costCenterForm_name');

  getDescriptionTextarea = (): Cypress.Chainable => cy.get('#costCenterForm_description');

  getBusinessUnitCheckbox = (idBusinessUnit: number): Cypress.Chainable =>
    cy.get(`[name="costCenterForm[companyBusinessUnitIds][]"][value="${idBusinessUnit}"]`);

  getSubmitButton = (): Cypress.Chainable => cy.get('[data-qa="submit-button"]');

  getSuccessFlashMessage = (): Cypress.Chainable => cy.get('[data-qa="component notification-area"] flash-message');
}
