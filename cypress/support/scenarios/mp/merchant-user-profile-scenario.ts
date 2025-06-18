import { ProfilePage } from '@pages/mp';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantUserProfileScenario {
  @inject(ProfilePage) private profilePage: ProfilePage;

  executeChangePassword = (defaultPassword: string, newPassword: string): void => {
    this.profilePage.visit();
    this.profilePage.openChangePasswordForm();
    this.profilePage.changePassword(defaultPassword, newPassword);
    this.profilePage.waitForPasswordChangedMessage();
  };
}
