import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class BackofficeBudgetEditRepository {
  getNameInput = (): Cypress.Chainable => cy.get('[data-qa="budget-name"]');
  getAmountInput = (): Cypress.Chainable => cy.get('[data-qa="budget-amount"]');
  getCurrencySelect = (): Cypress.Chainable => cy.get('[data-qa="budget-currency"]');
  getEnforcementRuleSelect = (): Cypress.Chainable => cy.get('[data-qa="budget-enforcement-rule"]');
  getStartsAtInput = (): Cypress.Chainable => cy.get('[data-qa="budget-starts-at"]');
  getEndsAtInput = (): Cypress.Chainable => cy.get('[data-qa="budget-ends-at"]');
  getIsActiveCheckbox = (): Cypress.Chainable => cy.get('[data-qa="budget-is-active"]');
  getSaveButton = (): Cypress.Chainable => cy.get('[data-qa="submit-button"]');
  getSuccessMessage = (): Cypress.Chainable => cy.get('.alert-success');
}
