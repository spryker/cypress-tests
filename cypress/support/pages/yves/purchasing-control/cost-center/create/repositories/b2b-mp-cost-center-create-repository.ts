import { injectable } from 'inversify';
import { CostCenterCreateRepository } from '../cost-center-create-repository';

@injectable()
export class B2bMpCostCenterCreateRepository implements CostCenterCreateRepository {
  getNameInput = (): Cypress.Chainable => cy.get('[data-qa="cost-center-name-input"]');

  getDescriptionTextarea = (): Cypress.Chainable => cy.get('[data-qa="cost-center-description-input"]');

  getBusinessUnitCheckbox = (idBusinessUnit: number): Cypress.Chainable =>
    cy
      .get(`[name="costCenterForm[companyBusinessUnitIds][]"][value="${idBusinessUnit}"]`)
      .find('input[type="checkbox"]');

  getSubmitButton = (): Cypress.Chainable => cy.get('[data-qa="component cost-center-form"] [data-qa="submit-button"]');

  getSuccessFlashMessage = (): Cypress.Chainable =>
    cy.get('[data-qa="component notification-area"] flash-message');
}
