import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MpProfileRepository } from './mp-profile-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { MpPage } from '../mp-page';

@injectable()
@autoWired
export class MpProfilePage extends MpPage {
  protected PAGE_URL: string = '/merchant-profile-merchant-portal-gui/profile';

  constructor(@inject(MpProfileRepository) private repository: MpProfileRepository) {
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
