import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { BackofficeBudgetCreateRepository } from './budget-create-repository';

@injectable()
@autoWired
export class BackofficeBudgetCreatePage extends BackofficePage {
  @inject(BackofficeBudgetCreateRepository) private repository: BackofficeBudgetCreateRepository;

  protected PAGE_URL = '/purchasing-control/budget/create';

  visitByCostCenter = (idCostCenter: number): void => {
    cy.visitBackoffice(`/purchasing-control/budget/create?id-cost-center=${idCostCenter}`);
  };

  fillName = (name: string): void => {
    this.repository.getNameInput().clear().type(name);
  };

  fillAmount = (amount: string): void => {
    this.repository.getAmountInput().clear().type(amount);
  };

  selectCurrency = (currency: string): void => {
    this.repository.getCurrencySelect().select(currency, { force: true });
  };

  selectEnforcementRule = (rule: string): void => {
    this.repository.getEnforcementRuleSelect().select(rule, { force: true });
  };

  fillStartDate = (date: string): void => {
    this.repository.getStartsAtInput().type(date);
  };

  fillEndDate = (date: string): void => {
    this.repository.getEndsAtInput().type(date);
  };

  submit = (): void => {
    this.repository.getSaveButton().click();
  };

  getSuccessMessage = (): Cypress.Chainable => this.repository.getSuccessMessage();
}
