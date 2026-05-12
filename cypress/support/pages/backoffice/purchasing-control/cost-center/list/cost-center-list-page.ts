import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CostCenterListRepository } from './cost-center-list-repository';

@injectable()
@autoWired
export class CostCenterListPage extends BackofficePage {
  @inject(CostCenterListRepository) private repository: CostCenterListRepository;

  protected PAGE_URL = '/purchasing-control/cost-center';

  waitForTable = (): void => {
    cy.intercept('GET', '**/purchasing-control/cost-center/table**').as('costCenterTable');
    this.visit();
    cy.wait('@costCenterTable');
  };

  clickCreateButton = (): void => {
    cy.get(this.repository.getCreateButtonSelector()).click();
  };

  clickEditButton = (idCostCenter: number): void => {
    cy.visitBackoffice(`/purchasing-control/cost-center/edit?id-cost-center=${idCostCenter}`);
  };

  clickBudgetsButton = (idCostCenter: number): void => {
    cy.visitBackoffice(`/purchasing-control/budget?id-cost-center=${idCostCenter}`);
  };

  assertCostCenterInTable = (name: string): void => {
    cy.intercept('GET', '**/purchasing-control/cost-center/table**').as('costCenterTableAssert');
    this.visit();
    cy.wait('@costCenterTableAssert');
    cy.get(this.repository.getTableBodySelector()).should('contain', name);
  };
}
