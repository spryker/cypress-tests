import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { AccountRepository } from './account-repository';

@injectable()
@autoWired
export class AccountPage extends MpPage {
  @inject(AccountRepository) private repository: AccountRepository;

  protected PAGE_URL = '/user-merchant-portal-gui/my-account';

  openChangePasswordForm = (): void => {
    this.repository.getChangePasswordButton().click();
  };

  changePassword(defaultPassword: string, newPassword: string): void {
    this.repository.getDefaultPasswordInput().type(defaultPassword);
    this.repository.getNewPasswordInput().type(newPassword);
    this.repository.getConfirmPasswordInput().type(newPassword);
    this.repository.getSubmitButton().click();
  }

  waitForPasswordChangedMessage(): void {
    cy.contains(this.repository.getPasswordChangedMessage()).should('be.visible');
  }
}
