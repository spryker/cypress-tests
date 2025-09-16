import { User, Merchant } from './shared';

export interface MerchantCombinedProductDynamicFixtures {
  rootUser: User;
  merchantUser: User;
}

export interface MerchantCombinedProductOfferDynamicFixtures {
  rootUser: User;
  merchantUser: User;
  merchant: Merchant;
}

export interface MerchantCombinedProductStaticFixtures {
  defaultPassword: string;
}

export interface MerchantCombinedProductOfferStaticFixtures {
  defaultPassword: string;
  productSku: string;
}
