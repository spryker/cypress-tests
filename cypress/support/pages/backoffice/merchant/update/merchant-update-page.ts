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

  rename = (params: RenameParams): void => {
    this.repository.getNameInput().clear().type(params.name);
    this.repository.getSaveButton().click();
  };

  // Taking every store off the relation is what retires the merchant's storefront page.
  unassignAllStores = (): void => {
    this.repository.getAllAvailableStoresInputs().uncheck({ force: true });
    this.repository.getSaveButton().click();
  };

  assignAllAvailableStore = (): void => {
    this.repository.getAllAvailableStoresInputs().check();
    this.repository.getSaveButton().click();
  };
}

interface RenameParams {
  name: string;
}
