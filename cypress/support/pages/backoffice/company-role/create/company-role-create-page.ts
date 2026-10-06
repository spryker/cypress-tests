import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CompanyRoleCreateRepository } from './company-role-create-repository';

@injectable()
@autoWired
export class CompanyRoleCreatePage extends BackofficePage {
  @inject(CompanyRoleCreateRepository) private repository: CompanyRoleCreateRepository;

  protected PAGE_URL = '/company-role-gui/create-company-role';

  getCompanyRoleCreateForm = (): Cypress.Chainable => {
    return this.repository.getCompanyRoleCreateForm();
  };

  create = (params: CreateParams): void => {
    this.selectCompany(params.companyName);
    this.repository.getNameInput().clear().type(params.name);
    this.repository.getPermissionCheckbox(params.permissionName).check({ force: true });
    this.repository.getSubmitButton().click();
  };

  private selectCompany = (companyName: string): void => {
    cy.intercept('GET', '**/company-gui/suggest*').as('companySuggest');

    this.repository.getCompanySelect().siblings('.select2-container').find('.select2-selection').click();
    cy.get('.select2-dropdown .select2-search__field').type(companyName);
    cy.wait('@companySuggest');
    cy.contains('.select2-dropdown .select2-results__option', companyName).click();
  };
}

interface CreateParams {
  companyName: string;
  name: string;
  permissionName: string;
}
