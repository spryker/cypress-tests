import { inject, injectable } from 'inversify';
import { MerchantListPage } from '../../pages/backoffice/merchant/list/merchant-list-page';
import { MerchantUserCreatePage } from '../../pages/backoffice/merchant-user/create/merchant-user-create-page';
import { UserIndexPage } from '../../pages/backoffice/user/index/user-index-page';
import { UserUpdatePage } from '../../pages/backoffice/user/update/user-update-page';
import { MerchantUpdatePage } from '../../pages/backoffice/merchant/update/merchant-update-page';
import { autoWired } from '../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class CreateMerchantUserScenario {
  constructor(
    @inject(MerchantListPage) private merchantListPage: MerchantListPage,
    @inject(MerchantUpdatePage) private merchantUpdatePage: MerchantUpdatePage,
    @inject(MerchantUserCreatePage) private merchantUserCreatePage: MerchantUserCreatePage,
    @inject(UserIndexPage) private userIndexPage: UserIndexPage,
    @inject(UserUpdatePage) private userUpdatePage: UserUpdatePage
  ) {}

  public execute = (merchantName: string): MerchantUser => {
    cy.visitBackoffice(this.merchantListPage.PAGE_URL);
    this.merchantListPage.editMerchant(merchantName);

    this.merchantUpdatePage.createNewUser();
    const merchantUser: MerchantUser = this.merchantUserCreatePage.createMerchantUser();

    cy.visitBackoffice(this.userIndexPage.PAGE_URL);
    this.userIndexPage.activateUser(merchantUser.username);
    cy.visitBackoffice(this.userIndexPage.PAGE_URL);
    this.userIndexPage.editUser(merchantUser.username);

    this.userUpdatePage.setDefaultPassword();

    merchantUser.user = {
      username: merchantUser.username,
      password: this.userUpdatePage.DEFAULT_PASSWORD,
    };

    return merchantUser;
  };
}
