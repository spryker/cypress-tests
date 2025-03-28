import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CustomerDeleteRepository } from './customer-delete-repository';

@injectable()
@autoWired
export class CustomerDeletePage extends YvesPage {
  @inject(REPOSITORIES.CustomerDeleteRepository) private repository: CustomerDeleteRepository;

  protected PAGE_URL = '/customer/delete';

  clickDeleteAccount(): void {
    this.repository.getDeleteButton().click();
  }
}
