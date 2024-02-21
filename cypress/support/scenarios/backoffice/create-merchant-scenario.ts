import { inject, injectable } from 'inversify';
import { BackofficeMerchantCreatePage } from '../../pages/backoffice/merchant/create/backoffice-merchant-create-page';
import { BackofficeMerchantListPage } from '../../pages/backoffice/merchant/list/backoffice-merchant-list-page';
import { autoWired } from '../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class CreateMerchantScenario {
  constructor(
    @inject(BackofficeMerchantCreatePage) private merchantCreatePage: BackofficeMerchantCreatePage,
    @inject(BackofficeMerchantListPage) private merchantListPage: BackofficeMerchantListPage
  ) {}

  public execute = (): Merchant => {
    cy.visitBackoffice(this.merchantCreatePage.PAGE_URL);
    const merchant: Merchant = this.merchantCreatePage.createMerchant();

    cy.visitBackoffice(this.merchantListPage.PAGE_URL);
    this.merchantListPage.approveAccessMerchant(merchant.name);

    return merchant;
  };
}
