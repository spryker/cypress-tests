import { injectable } from 'inversify';
import { CostCenterUpdateRepository } from '../cost-center-update-repository';

@injectable()
export class B2bMpCostCenterUpdateRepository implements CostCenterUpdateRepository {
  getNameInput = (): Cypress.Chainable => cy.get('[data-qa="cost-center-name-input"]');

  getDescriptionTextarea = (): Cypress.Chainable => cy.get('[data-qa="cost-center-description-input"]');

  getIsActiveCheckbox = (): Cypress.Chainable => cy.get('#costCenterForm_isActive');

  getSubmitButton = (): Cypress.Chainable => cy.get('[data-qa="component cost-center-form"] [data-qa="submit-button"]');

  getSuccessFlashMessage = (): Cypress.Chainable => cy.get('[data-qa="component notification-area"] flash-message');
}
