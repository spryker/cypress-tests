import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CompanyRoleIndexRepository } from './company-role-index-repository';

@injectable()
@autoWired
export class CompanyRoleIndexPage extends YvesPage {
  @inject(REPOSITORIES.CompanyRoleIndexRepository)
  private repository: CompanyRoleIndexRepository;

  protected PAGE_URL = '/company/company-role';

  clickAddNewRole = (): void => {
    this.repository.getAddNewRoleButton().click();
  };
}
