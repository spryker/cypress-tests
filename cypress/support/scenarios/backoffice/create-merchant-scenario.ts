import { inject, injectable } from 'inversify';
import { MerchantCreatePage } from '../../pages/backoffice/merchant/create/merchant-create-page';
import { MerchantListPage } from '../../pages/backoffice/merchant/list/merchant-list-page';
import { autoWired } from '../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class CreateMerchantScenario {
  constructor(
    @inject(MerchantCreatePage) private merchantCreatePage: MerchantCreatePage,
    @inject(MerchantListPage) private merchantListPage: MerchantListPage
  ) {}

  public execute = (): Merchant => {
    cy.visitBackoffice(this.merchantCreatePage.PAGE_URL);
    const merchant: Merchant = this.merchantCreatePage.createMerchant();

    cy.visitBackoffice(this.merchantListPage.PAGE_URL);
    this.merchantListPage.approveAccessMerchant(merchant.name);

    return merchant;
  };
}
