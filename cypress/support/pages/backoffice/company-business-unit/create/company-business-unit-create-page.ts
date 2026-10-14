import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CompanyBusinessUnitCreateRepository } from './company-business-unit-create-repository';

@injectable()
@autoWired
export class CompanyBusinessUnitCreatePage extends BackofficePage {
  @inject(CompanyBusinessUnitCreateRepository) private repository: CompanyBusinessUnitCreateRepository;

  protected PAGE_URL = '/company-business-unit-gui/add-company-business-unit';

  create = (params: CreateParams): void => {
    this.selectCompany(params.companyName);
    this.repository.getNameInput().clear().type(params.name);
    this.repository.getSubmitButton().click();
  };

  /**
   * The company choices are rendered server side and labelled "<name> (ID: <id>)". Some Back Offices
   * dress the select up with select2 and some leave it plain, so the option is picked on the select
   * itself, by the value of the option that carries the name.
   */
  private selectCompany = (companyName: string): void => {
    this.repository
      .getCompanySelect()
      .find('option')
      .contains(companyName)
      .then(($option) => {
        this.repository.getCompanySelect().select($option.val() as string, { force: true });
      });
  };
}

interface CreateParams {
  companyName: string;
  name: string;
}
