import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { BackofficeBudgetEditRepository } from './budget-edit-repository';

@injectable()
@autoWired
export class BackofficeBudgetEditPage extends BackofficePage {
  @inject(BackofficeBudgetEditRepository) private repository: BackofficeBudgetEditRepository;

  protected PAGE_URL = '/purchasing-control/budget/edit';

  visitById = (idBudget: number, idCostCenter: number): void => {
    cy.visitBackoffice(`/purchasing-control/budget/edit?id-cost-center=${idCostCenter}&id-budget=${idBudget}`);
  };

  fillName = (name: string): void => {
    this.repository.getNameInput().clear().type(name);
  };

  fillAmount = (amount: string): void => {
    this.repository.getAmountInput().clear().type(amount);
  };

  submit = (): void => {
    this.repository.getSaveButton().click();
  };

  getSuccessMessage = (): Cypress.Chainable => this.repository.getSuccessMessage();

  getNameValue = (): Cypress.Chainable<string> => {
    return this.repository.getNameInput().invoke('val') as Cypress.Chainable<string>;
  };
}
