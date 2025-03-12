import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { ManageCompanyRoleUserRepository } from './manage-company-role-user-repository';
import VisitOptions = Cypress.VisitOptions;

@injectable()
@autoWired
export class ManageCompanyRoleUserPage extends YvesPage {
  @inject(REPOSITORIES.ManageCompanyRoleUserRepository) private repository: ManageCompanyRoleUserRepository;

  protected PAGE_URL = '/company/company-role/user/manage';

  visit = (options?: Partial<VisitOptions>, idCompanyRole = 0): void => {
    cy.visit(this.PAGE_URL + '?id=' + idCompanyRole, options);
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

  requestUnassignUrl = (idCompanyUser: number, idCompanyRole: number): Cypress.Chainable => {
    return cy.visit(
      '/company/company-role/user/unassign??id-company-user=' +
        idCompanyUser +
        '&id-company-role=' +
        idCompanyRole +
        '&_token=BAD_TOKEN'
    );
  };
}
