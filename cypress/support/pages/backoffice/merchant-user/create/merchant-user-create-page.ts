import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficePage } from '../../backoffice-page';
import { MerchantUserCreateRepository } from './merchant-user-create-repository';

@injectable()
@autoWired
export class MerchantUserCreatePage extends BackofficePage {
  @inject(MerchantUserCreateRepository) private repository: MerchantUserCreateRepository;

  protected PAGE_URL: string = '/merchant-user-gui/edit-merchant-user';

  public createMerchantUser = () => {
    const uniquePrefix: string = this.faker.number.int({ min: 1000, max: 9999 }).toString();

    const merchantUser = {
      username: this.faker.internet.email(),
      firstName: uniquePrefix + '_' + this.faker.person.firstName(),
      lastName: uniquePrefix + '_' + this.faker.person.lastName(),
    };

    this.repository.getEmailInput().clear().type(merchantUser.username);
    this.repository.getFirstNameInput().clear().type(merchantUser.firstName);
    this.repository.getLastNameInput().clear().type(merchantUser.lastName);

    this.repository.getCreateButton().click();

    return merchantUser;
  };
}
