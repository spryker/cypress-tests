import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MerchantUserCreateRepository } from './merchant-user-create-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';
import { BackofficePage } from '../../backoffice-page';

@injectable()
@autoWired
export class MerchantUserCreatePage extends BackofficePage {
  protected PAGE_URL: string = '/merchant-user-gui/edit-merchant-user';

  constructor(
    @inject(MerchantUserCreateRepository) private repository: MerchantUserCreateRepository
  ) {
    super();
  }

  public createMerchantUser = (merchantUser?: MerchantUser): MerchantUser => {
    if (!merchantUser) {
      const uniquePrefix: string = this.faker.number.int({ min: 1000, max: 9999 }).toString();

      merchantUser = {
        username: this.faker.internet.email(),
        firstName: uniquePrefix + '_' + this.faker.person.firstName(),
        lastName: uniquePrefix + '_' + this.faker.person.lastName(),
      };
    }

    this.repository.getEmailInput().clear().type(merchantUser.username);
    this.repository.getFirstNameInput().clear().type(merchantUser.firstName);
    this.repository.getLastNameInput().clear().type(merchantUser.lastName);

    this.repository.getCreateButton().click();

    return merchantUser;
  };
}
