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

  assertCostCenterInTable = (name: string): void => {
    cy.visit(`/company/cost-center?costCenterSearchForm[name]=${encodeURIComponent(name)}`);
    this.repository.getTableRows().should('contain', name);
  };

  assertStatusBadge = (uuid: string, expectedStatus: string): void => {
    this.repository.getStatusBadgeByUuid(uuid).should('contain', expectedStatus);
  };
}
