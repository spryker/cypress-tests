import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CompanyRoleUserManageRepository } from './company-role-user-manage-repository';
import VisitOptions = Cypress.VisitOptions;

@injectable()
@autoWired
export class CompanyRoleUserManagePage extends YvesPage {
  @inject(REPOSITORIES.CompanyRoleUserManageRepository) private repository: CompanyRoleUserManageRepository;

  protected PAGE_URL = '/DE/en/company/company-role/user/manage';

  visit = (options?: Partial<VisitOptions>, idCompanyUser = 0): void => {
    cy.visit(this.PAGE_URL + '?id=' + idCompanyUser, options);
  };

  unassignUser = (): void => {
    this.repository.getFirstUserUnassignButton().click();
  };

  assignUser = (): void => {
    this.repository.getFirstUserAssignButton().click();
  };

  assertTopRowHasAssignButton = (): void => {
    this.repository.getFirstUserUnassignButton().should('be.visible');
  };
}
