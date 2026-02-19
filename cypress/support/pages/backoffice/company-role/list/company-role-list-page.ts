import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ActionEnum, BackofficePage } from '@pages/backoffice';
import { CompanyRoleListRepository } from './company-role-list-repository';

@injectable()
@autoWired
export class CompanyRoleListPage extends BackofficePage {
  @inject(CompanyRoleListRepository) private repository: CompanyRoleListRepository;

  protected PAGE_URL = '/company-role-gui/list-company-role';

  update = (params: UpdateParams): void => {
    this.find({
      interceptTableUrl: `**/company-role-gui/list-company-role/table**${params.query}**`,
      searchQuery: params.query,
    }).then(($companyRoleRow) => {
      if (params.action === ActionEnum.edit) {
        this.clickEditAction($companyRoleRow);
      }

      if (params.action === ActionEnum.delete) {
        this.clickDeleteAction($companyRoleRow);
      }
    });
  };

  clickEditAction = ($row: JQuery<HTMLElement>): void => {
    cy.wrap($row).find(this.repository.getEditButtonSelector()).click();
  };

  clickDeleteAction = ($row: JQuery<HTMLElement>): void => {
    cy.wrap($row).find(this.repository.getDeleteButtonSelector()).click();
  };

  clickAddCompanyUserRoleButton = (): void => {
    this.repository.getAddCompanyUserRoleButton().click();
  };
}

interface UpdateParams {
  action: ActionEnum;
  query: string;
}
