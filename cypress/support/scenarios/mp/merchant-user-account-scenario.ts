import { AccountPage } from '@pages/mp';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantUserAccountScenario {
  @inject(AccountPage) private accountPage: AccountPage;

  executeChangePassword = (defaultPassword: string, newPassword: string): void => {
    this.accountPage.visit();
    this.accountPage.openChangePasswordForm();
    this.accountPage.changePassword(defaultPassword, newPassword);
    this.accountPage.waitForPasswordChangedMessage();
  };
}
