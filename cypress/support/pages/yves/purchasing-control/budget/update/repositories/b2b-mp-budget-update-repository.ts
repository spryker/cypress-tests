import { injectable } from 'inversify';
import { BudgetUpdateRepository } from '../budget-update-repository';

@injectable()
export class B2bMpBudgetUpdateRepository implements BudgetUpdateRepository {
  getNameInput = (): Cypress.Chainable => cy.get('[data-qa="budget-name-input"]');

  getAmountInput = (): Cypress.Chainable => cy.get('[data-qa="budget-amount-input"]');

  getSubmitButton = (): Cypress.Chainable => cy.get('[data-qa="component budget-form"] [data-qa="submit-button"]');

  getSuccessFlashMessage = (): Cypress.Chainable => cy.get('[data-qa="component notification-area"] flash-message');
}
