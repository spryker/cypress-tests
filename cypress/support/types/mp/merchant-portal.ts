import { Merchant, ProductConcrete, Url, User } from './shared';

export interface MerchantProfileUpdateDynamicFixtures {
  merchantUser: User;
  merchant: Merchant;
  merchantUrlEN: Url;
}

export interface MerchantProfileUpdateStaticFixtures {
  defaultPassword: string;
}

export interface MerchantStoreStatusDynamicFixtures {
  merchantUser: User;
  merchant: Merchant;
  merchantUrlEN: Url;
  merchantProduct: ProductConcrete;
}

export interface MerchantStoreStatusStaticFixtures {
  defaultPassword: string;
}
