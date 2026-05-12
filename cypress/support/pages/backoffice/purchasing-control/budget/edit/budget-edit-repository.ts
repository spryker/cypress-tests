import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class BackofficeBudgetEditRepository {
  getNameInput = (): Cypress.Chainable => cy.get('#budget_form_name');
  getAmountInput = (): Cypress.Chainable => cy.get('#budget_form_amount');
  getCurrencySelect = (): Cypress.Chainable => cy.get('#budget_form_currencyIsoCode');
  getEnforcementRuleSelect = (): Cypress.Chainable => cy.get('#budget_form_enforcementRule');
  getStartsAtInput = (): Cypress.Chainable => cy.get('#budget_form_startsAt');
  getEndsAtInput = (): Cypress.Chainable => cy.get('#budget_form_endsAt');
  getIsActiveCheckbox = (): Cypress.Chainable => cy.get('#budget_form_isActive');
  getSaveButton = (): Cypress.Chainable => cy.get('button[type="submit"]:contains("Save")');
  getSuccessMessage = (): Cypress.Chainable => cy.get('.alert-success');
}
