import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CompanyBusinessUnitCreateRepository } from './company-business-unit-create-repository';

@injectable()
@autoWired
export class CompanyBusinessUnitCreatePage extends YvesPage {
  @inject(CompanyBusinessUnitCreateRepository) private repository: CompanyBusinessUnitCreateRepository;

  protected PAGE_URL = '/company/business-unit';

  create = (params: CreateParams): void => {
    this.repository.getCreateButton().click();
    this.repository.getNameInput().clear().type(params.name);
    this.repository.getEmailInput().clear().type(params.email);
    this.repository.getSubmitButton().click();
  };
}

interface CreateParams {
  name: string;
  email: string;
}
