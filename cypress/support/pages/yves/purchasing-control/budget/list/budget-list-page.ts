import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { BudgetListRepository } from './budget-list-repository';

@injectable()
@autoWired
export class YvesBudgetListPage extends YvesPage {
  @inject(REPOSITORIES.YvesBudgetListRepository)
  private repository: BudgetListRepository;

  protected PAGE_URL = '/company/cost-center/budget';

  visitByCostCenterUuid = (costCenterUuid: string): void => {
    cy.visit(`/company/cost-center/budget?cost-center-uuid=${costCenterUuid}`);
  };

  clickCreateButton = (): void => {
    this.repository.getCreateButton().click();
  };

  clickEditButton = (budgetUuid: string): void => {
    this.repository.getEditButtonByUuid(budgetUuid).click();
  };

  assertBudgetInTable = (name: string): void => {
    this.repository.getTableRows().should('contain', name);
  };
}
