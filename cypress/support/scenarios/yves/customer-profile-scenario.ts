import { inject, injectable } from 'inversify';
import { autoWired } from '@utils';
import { CustomerProfilePage } from '../../pages/yves/customer/profile/customer-profile-page';

@injectable()
@autoWired
export class CustomerProfileScenario {
  @inject(CustomerProfilePage) private profilePage: CustomerProfilePage;

  executePasswordChange(credentials: PasswordChangeParams): void {
    this.profilePage.changePassword(credentials.password, credentials.newPassword);
    this.profilePage.waitForPasswordChangedMessage();
  }
}

interface PasswordChangeParams {
  password: string;
  newPassword: string;
}
