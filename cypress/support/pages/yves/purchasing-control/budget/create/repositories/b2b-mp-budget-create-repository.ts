import { injectable } from 'inversify';
import { BudgetCreateRepository } from '../budget-create-repository';

@injectable()
export class B2bMpBudgetCreateRepository implements BudgetCreateRepository {
  getNameInput = (): Cypress.Chainable => cy.get('[data-qa="budget-name-input"]');

  getAmountInput = (): Cypress.Chainable => cy.get('[data-qa="budget-amount-input"]');

  getCurrencySelect = (): Cypress.Chainable => cy.get('[data-qa="budget-currency-select"]');

  getEnforcementRuleSelect = (): Cypress.Chainable =>
    cy.get('[data-qa="budget-enforcement-rule-select"]').then(($el) => {
      $el.show();
      return $el;
    });

  getStartsAtInput = (): Cypress.Chainable => cy.get('[data-qa="budget-starts-at-input"]');

  getEndsAtInput = (): Cypress.Chainable => cy.get('[data-qa="budget-ends-at-input"]');

  getSubmitButton = (): Cypress.Chainable => cy.get('[data-qa="component budget-form"] [data-qa="submit-button"]');

  getSuccessFlashMessage = (): Cypress.Chainable => cy.get('[data-qa="component notification-area"] flash-message');
}
