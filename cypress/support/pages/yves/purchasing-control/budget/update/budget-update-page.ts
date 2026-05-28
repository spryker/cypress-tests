import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { BudgetUpdateRepository } from './budget-update-repository';

@injectable()
@autoWired
export class YvesBudgetUpdatePage extends YvesPage {
  @inject(REPOSITORIES.YvesBudgetUpdateRepository)
  private repository: BudgetUpdateRepository;

  protected PAGE_URL = '/company/cost-center/budget/update';

  visitByUuid = (budgetUuid: string, costCenterUuid: string): void => {
    cy.visit(`/company/cost-center/budget/update?budgetUuid=${budgetUuid}&costCenterUuid=${costCenterUuid}`);
  };

  fillName = (name: string): void => {
    this.repository.getNameInput().clear().type(name);
  };

  fillAmount = (amount: string): void => {
    this.repository.getAmountInput().clear().type(amount);
  };

  submit = (): void => {
    this.repository.getSubmitButton().click();
  };

  assertSuccess = (): void => {
    this.repository.getSuccessFlashMessage().should('be.visible');
  };

  getNameValue = (): Cypress.Chainable<string> => {
    return this.repository.getNameInput().invoke('val') as Cypress.Chainable<string>;
  };
}
