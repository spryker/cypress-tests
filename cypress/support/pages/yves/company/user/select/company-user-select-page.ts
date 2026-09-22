import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CompanyUserSelectRepository } from './company-user-select-repository';

@injectable()
@autoWired
export class CompanyUserSelectPage extends YvesPage {
  @inject(REPOSITORIES.CompanyUserSelectRepository) private repository: CompanyUserSelectRepository;

  protected PAGE_URL = '/company/user/select';

  getBusinessUnitOptions = (): Cypress.Chainable => this.repository.getBusinessUnitOptions();

  getActiveBusinessUnitLink = (): Cypress.Chainable => this.repository.getActiveBusinessUnitLink();

  selectBusinessUnit = (params: SelectBusinessUnitParams): void => {
    this.repository.getBusinessUnitSelect().select(params.idCompanyUser.toString(), { force: true });
    this.repository.getSubmitButton().click();
  };
}

interface SelectBusinessUnitParams {
  idCompanyUser: number;
}
