import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { MerchantUserUpdateRepository } from './merchant-user-update-repository';

@injectable()
@autoWired
export class MerchantUserUpdatePage extends BackofficePage {
  @inject(MerchantUserUpdateRepository) private repository: MerchantUserUpdateRepository;

  protected PAGE_URL = '/merchant-user-gui/edit-user';

  activateUser = (): void => {
    this.repository.getStatusSelect().select('Active');
    this.repository.getSaveButton().click();
  };

  setUserAsActive = (): void => {
    this.repository.getIsActiveCheckbox().check();
    this.repository.getSaveButton().click();
  };

  activateUserWithPassword = (password: string): void => {
    this.repository.getIsActiveCheckbox().check();
    this.repository.getPasswordInput().clear().type(password);
    this.repository.getPasswordConfirmInput().clear().type(password);
    this.repository.getSaveButton().click();
  };
}
