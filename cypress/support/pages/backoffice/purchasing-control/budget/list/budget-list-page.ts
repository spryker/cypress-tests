import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { BackofficeBudgetListRepository } from './budget-list-repository';

@injectable()
@autoWired
export class BackofficeBudgetListPage extends BackofficePage {
  @inject(BackofficeBudgetListRepository) private repository: BackofficeBudgetListRepository;

  protected PAGE_URL = '/purchasing-control/budget';

  visitByCostCenter = (idCostCenter: number): void => {
    cy.visitBackoffice(`/purchasing-control/budget?id-cost-center=${idCostCenter}`);
  };

  clickCreateButton = (): void => {
    cy.get(this.repository.getCreateButtonSelector()).click();
  };

  clickEditButton = (idBudget: number, idCostCenter: number): void => {
    cy.visitBackoffice(`/purchasing-control/budget/edit?id-cost-center=${idCostCenter}&id-budget=${idBudget}`);
  };

  assertBudgetInTable = (name: string): void => {
    cy.intercept('GET', '**/purchasing-control/budget/table**').as('budgetTableAssert');
    cy.wait('@budgetTableAssert');
    cy.get(this.repository.getTableBodySelector()).should('contain', name);
  };
}
