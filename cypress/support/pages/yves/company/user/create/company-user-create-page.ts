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
    this.selectBusinessUnitByName(params.businessUnitName);
    this.repository.getRoleCheckboxLabel(params.roleName).check({ force: true });
    this.repository.getEmailInput().clear().type(params.email);
    this.repository.getFirstNameInput().clear().type(params.firstName);
    this.repository.getLastNameInput().clear().type(params.lastName);
    this.repository.getSubmitButton().click();
  };

  /**
   * The options are labelled "<name> (ID: <id>)", so an exact-text select can never match a bare
   * name. Read the id off the option whose label carries the name, then select by that.
   */
  private selectBusinessUnitByName = (name: string): void => {
    this.repository
      .getBusinessUnitSelect()
      .find('option')
      .contains(name)
      .then(($option) => {
        this.repository.getBusinessUnitSelect().select($option.val() as string, { force: true });
      });
  };
}

interface CreateParams {
  businessUnitName: string;
  roleName: string;
  email: string;
  firstName: string;
  lastName: string;
}
