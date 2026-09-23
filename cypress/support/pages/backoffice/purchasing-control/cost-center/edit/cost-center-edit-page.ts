import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CostCenterEditRepository } from './cost-center-edit-repository';

@injectable()
@autoWired
export class CostCenterEditPage extends BackofficePage {
  @inject(CostCenterEditRepository) private repository: CostCenterEditRepository;

  protected PAGE_URL = '/purchasing-control/cost-center/edit';

  visitById = (idCostCenter: number): void => {
    cy.visitBackoffice(`/purchasing-control/cost-center/edit?id-cost-center=${idCostCenter}`);
  };

  fillName = (name: string): void => {
    this.repository.getNameInput().clear().type(name);
  };

  fillDescription = (description: string): void => {
    this.repository.getDescriptionTextarea().clear().type(description);
  };

  submit = (): void => {
    this.repository.getSaveButton().click();
  };

  getSuccessMessage = (): Cypress.Chainable => this.repository.getSuccessMessage();

  getNameValue = (): Cypress.Chainable<string> => {
    return this.repository.getNameInput().invoke('val') as Cypress.Chainable<string>;
  };
}
