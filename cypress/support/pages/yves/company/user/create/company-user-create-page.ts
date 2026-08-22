import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CompanyUserCreateRepository } from './company-user-create-repository';

@injectable()
@autoWired
export class CompanyUserCreatePage extends YvesPage {
  @inject(CompanyUserCreateRepository) private repository: CompanyUserCreateRepository;

  protected PAGE_URL = '/company/user';

  create = (params: CreateParams): void => {
    this.repository.getCreateButton().click();
    this.repository.getBusinessUnitSelect().select(params.businessUnitName, { force: true });
    this.repository.getRoleCheckboxLabel(params.roleName).check({ force: true });
    this.repository.getEmailInput().clear().type(params.email);
    this.repository.getFirstNameInput().clear().type(params.firstName);
    this.repository.getLastNameInput().clear().type(params.lastName);
    this.repository.getSubmitButton().click();
  };
}

interface CreateParams {
  businessUnitName: string;
  roleName: string;
  email: string;
  firstName: string;
  lastName: string;
}
