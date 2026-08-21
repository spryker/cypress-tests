import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CostCenterListRepository } from './cost-center-list-repository';

@injectable()
@autoWired
export class YvesCostCenterListPage extends YvesPage {
  @inject(REPOSITORIES.YvesCostCenterListRepository)
  private repository: CostCenterListRepository;

  protected PAGE_URL = '/company/cost-center';

  clickCreateButton = (): void => {
    this.repository.getCreateButton().click();
  };

  clickEditButton = (uuid: string): void => {
    this.repository.getEditButtonByUuid(uuid).click();
  };

  visitFilteredByName = (name: string): void => {
    cy.visit(`/company/cost-center?costCenterSearchForm[name]=${encodeURIComponent(name)}`);
  };

  getTableRows = (): Cypress.Chainable => this.repository.getTableRows();

  getStatusBadge = (uuid: string): Cypress.Chainable => this.repository.getStatusBadgeByUuid(uuid);
}
