import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import { BackofficeMerchantUserCreateRepository } from './backoffice-merchant-user-create-repository';

@injectable()
@autoProvide
export class BackofficeMerchantUserCreatePage extends AbstractPage {
  public PAGE_URL: string = '/merchant-user-gui/edit-merchant-user';

  constructor(
    @inject(BackofficeMerchantUserCreateRepository) private repository: BackofficeMerchantUserCreateRepository
  ) {
    super();
  }

  public createMerchantUser = (merchantUser?: MerchantUser): MerchantUser => {
    if (!merchantUser) {
      merchantUser = {
        username: this.faker.internet.email(),
        firstName: this.faker.person.firstName(),
        lastName: this.faker.person.lastName(),
      };
    }

    this.repository.getEmailInput().clear().type(merchantUser.username);
    this.repository.getFirstNameInput().clear().type(merchantUser.firstName);
    this.repository.getLastNameInput().clear().type(merchantUser.lastName);

    this.repository.getCreateButton().click();

    return merchantUser;
  };
}
