import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ProfileRepository } from './profile-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { MpPage } from '../mp-page';

@injectable()
@autoWired
export class ProfilePage extends MpPage {
  protected PAGE_URL: string = '/merchant-profile-merchant-portal-gui/profile';

  constructor(@inject(ProfileRepository) private repository: ProfileRepository) {
    super();
  }

  public updateMerchantPhoneNumber = (phone?: string) => {
    this.repository
      .getPhoneNumberInput()
      .clear()
      .type(phone ?? this.faker.phone.number());
    this.repository.getProfileForm().submit();
  };
}
