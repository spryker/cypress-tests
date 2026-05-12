import { injectable } from 'inversify';
import { BudgetCreateRepository } from '../budget-create-repository';

@injectable()
export class SuiteBudgetCreateRepository implements BudgetCreateRepository {
  getNameInput = (): Cypress.Chainable => cy.get('#budgetForm_name');

  getAmountInput = (): Cypress.Chainable => cy.get('#budgetForm_amount');

  getCurrencySelect = (): Cypress.Chainable => cy.get('#budgetForm_currencyIsoCode');

  getEnforcementRuleSelect = (): Cypress.Chainable => cy.get('#budgetForm_enforcementRule');

  getStartsAtInput = (): Cypress.Chainable => cy.get('#budgetForm_startsAt');

  getEndsAtInput = (): Cypress.Chainable => cy.get('#budgetForm_endsAt');

  getSubmitButton = (): Cypress.Chainable => cy.get('[data-qa="submit-button"]');

  getSuccessFlashMessage = (): Cypress.Chainable => cy.get('[data-qa="component notification-area"] flash-message');
}
