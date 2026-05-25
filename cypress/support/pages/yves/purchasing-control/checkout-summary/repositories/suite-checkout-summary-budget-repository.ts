import { injectable } from 'inversify';
import { CheckoutSummaryBudgetRepository } from '../checkout-summary-budget-repository';

@injectable()
export class SuiteCheckoutSummaryBudgetRepository implements CheckoutSummaryBudgetRepository {
  getCheckoutErrorMessage = (): Cypress.Chainable => cy.get('ul.list--alert');

  getWarnFlashMessage = (): Cypress.Chainable => cy.get('flash-message.flash-message--alert');

  getCostCenterSelectorValue = (): Cypress.Chainable => cy.get('.cost-center-selector__value');

  getBudgetRemainingAmount = (): Cypress.Chainable => cy.get('.cost-center-selector__remaining');

  getApproveButton = (): Cypress.Chainable => cy.get('button.button--success');

  getDeclineButton = (): Cypress.Chainable => cy.get('button.button--alert');
}
