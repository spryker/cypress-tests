import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { ProfileRepository } from './profile-repository';

@injectable()
@autoWired
export class ProfilePage extends MpPage {
  @inject(ProfileRepository) private repository: ProfileRepository;

  protected PAGE_URL = '/merchant-profile-merchant-portal-gui/profile';

  updatePhone = (params?: UpdatePhoneParams): void => {
    this.repository
      .getPhoneNumberInput()
      .clear()
      .type(params?.phone ?? this.faker.phone.number());

    this.repository.getProfileForm().submit();
  };

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

interface UpdatePhoneParams {
  phone: string;
}
