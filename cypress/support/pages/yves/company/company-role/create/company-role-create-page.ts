import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CompanyRoleCreateRepository } from './company-role-create-repository';

@injectable()
@autoWired
export class CompanyRoleCreatePage extends YvesPage {
  @inject(REPOSITORIES.CompanyRoleCreateRepository)
  private repository: CompanyRoleCreateRepository;

  protected PAGE_URL = '/company/company-role/create';

  getCompanyRoleForm = (): Cypress.Chainable => {
    return this.repository.getCompanyRoleForm();
  };
}
