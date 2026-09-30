import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CompanyCreateRepository } from './company-create-repository';

@injectable()
@autoWired
export class CompanyCreatePage extends BackofficePage {
  @inject(CompanyCreateRepository) private repository: CompanyCreateRepository;

  protected PAGE_URL = '/company-gui/add-company';

  create = (name: string): void => {
    this.repository.getNameInput().clear().type(name);
    this.repository.getSubmitButton().click();
  };
}
