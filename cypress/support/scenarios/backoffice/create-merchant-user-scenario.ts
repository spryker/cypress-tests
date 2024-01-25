import { inject, injectable } from 'inversify';
import { autoProvide } from '../../utils/inversify/auto-provide';
import { BackofficeMerchantListPage } from '../../pages/backoffice/merchant/list/backoffice-merchant-list-page';
import { BackofficeMerchantUserCreatePage } from '../../pages/backoffice/merchant-user/create/backoffice-merchant-user-create-page';
import { BackofficeUserIndexPage } from '../../pages/backoffice/user/index/backoffice-user-index-page';
import { BackofficeUserUpdatePage } from '../../pages/backoffice/user/update/backoffice-user-update-page';
import { BackofficeMerchantUpdatePage } from '../../pages/backoffice/merchant/update/backoffice-merchant-update-page';

@injectable()
@autoProvide
export class CreateMerchantUserScenario {
  constructor(
    @inject(BackofficeMerchantListPage) private merchantListPage: BackofficeMerchantListPage,
    @inject(BackofficeMerchantUpdatePage) private merchantUpdatePage: BackofficeMerchantUpdatePage,
    @inject(BackofficeMerchantUserCreatePage) private merchantUserCreatePage: BackofficeMerchantUserCreatePage,
    @inject(BackofficeUserIndexPage) private userIndexPage: BackofficeUserIndexPage,
    @inject(BackofficeUserUpdatePage) private userUpdatePage: BackofficeUserUpdatePage
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
