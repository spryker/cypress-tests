import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '../../../yves-page';
import { CompanyUserSelectRepository } from './company-user-select-repository';

@injectable()
@autoWired
export class CompanyUserSelectPage extends YvesPage {
  @inject(REPOSITORIES.CompanyUserSelectRepository) private repository: CompanyUserSelectRepository;

  protected PAGE_URL = '/company/user/select';

  selectBusinessUnit = (idCompanyUser: number): void => {
    this.repository.getBusinessUnitSelect().select(idCompanyUser.toString());
    this.repository.getSubmitButton().click();
  };
}
