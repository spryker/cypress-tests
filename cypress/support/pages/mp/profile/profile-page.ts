import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '../mp-page';
import { ProfileRepository } from './profile-repository';

@injectable()
@autoWired
export class ProfilePage extends MpPage {
  @inject(ProfileRepository) private repository: ProfileRepository;

  protected PAGE_URL = '/merchant-profile-merchant-portal-gui/profile';

  updateMerchantPhoneNumber = (phone?: string) => {
    this.repository
      .getPhoneNumberInput()
      .clear()
      .type(phone ?? this.faker.phone.number());
    this.repository.getProfileForm().submit();
  };
}
