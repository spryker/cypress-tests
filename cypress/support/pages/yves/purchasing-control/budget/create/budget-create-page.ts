import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { BudgetCreateRepository } from './budget-create-repository';

@injectable()
@autoWired
export class YvesBudgetCreatePage extends YvesPage {
  @inject(REPOSITORIES.YvesBudgetCreateRepository)
  private repository: BudgetCreateRepository;

  protected PAGE_URL = '/company/cost-center/budget/create';

  visitByCostCenterUuid = (costCenterUuid: string): void => {
    cy.visit(`/company/cost-center/budget/create?costCenterUuid=${costCenterUuid}`);
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
    this.repository.getSubmitButton().click();
  };

  getSuccessFlashMessage = (): Cypress.Chainable => this.repository.getSuccessFlashMessage();
}
