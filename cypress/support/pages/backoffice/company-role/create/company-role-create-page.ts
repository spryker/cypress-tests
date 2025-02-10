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
}
