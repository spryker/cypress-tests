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

  // The company choices are rendered server side, so the select2 search filters them without a request.
  private selectCompany = (companyName: string): void => {
    this.repository.getCompanySelect().siblings('.select2-container').find('.select2-selection').click();
    cy.get('.select2-dropdown .select2-search__field').type(companyName);
    cy.contains('.select2-dropdown .select2-results__option', companyName).click();
  };
}

interface CreateParams {
  companyName: string;
  name: string;
}
