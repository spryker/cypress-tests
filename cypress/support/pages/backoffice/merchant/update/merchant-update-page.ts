import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { MerchantUpdateRepository } from './merchant-update-repository';

@injectable()
@autoWired
export class MerchantUpdatePage extends BackofficePage {
  @inject(MerchantUpdateRepository) private repository: MerchantUpdateRepository;

  protected PAGE_URL = '/merchant-gui/edit-merchant';

  create = (): void => {
    this.repository.getUsersTab().click();
    this.repository.getAddMerchantUserButton().click();
  };

  assignAllAvailableStore = (): void => {
    this.repository.getAllAvailableStoresInputs().check();
    this.repository.getSaveButton().click();
  };
}
