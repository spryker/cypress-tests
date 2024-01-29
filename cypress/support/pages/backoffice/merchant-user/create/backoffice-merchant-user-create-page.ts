import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficeMerchantUserCreateRepository } from './backoffice-merchant-user-create-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class BackofficeMerchantUserCreatePage extends AbstractPage {
  public PAGE_URL: string = '/merchant-user-gui/edit-merchant-user';

  constructor(
    @inject(BackofficeMerchantUserCreateRepository) private repository: BackofficeMerchantUserCreateRepository
  ) {
    super();
  }

  public createMerchantUser = (merchantUser?: MerchantUser): MerchantUser => {
    if (!merchantUser) {
      const identifier: string = this.faker.string.uuid();

      merchantUser = {
        username: this.faker.internet.email(),
        firstName: this.faker.person.firstName() + ' - ' + identifier,
        lastName: this.faker.person.lastName() + ' - ' + identifier,
      };
    }

    this.repository.getEmailInput().clear().type(merchantUser.username);
    this.repository.getFirstNameInput().clear().type(merchantUser.firstName);
    this.repository.getLastNameInput().clear().type(merchantUser.lastName);

    this.repository.getCreateButton().click();

    return merchantUser;
  };
}
