import { Merchant, ProductConcrete, Url, User } from '../mp/shared';

export interface MerchantDeactivationDynamicFixtures {
  rootUser: User;
  merchantUser: User;
  merchant: Merchant;
  merchantUrlEN: Url;
  merchantProduct: ProductConcrete;
}

export interface MerchantDeactivationStaticFixtures {
  defaultPassword: string;
}

export interface MerchantCrudDynamicFixtures {
  rootUser: User;
}

export interface MerchantCrudStaticFixtures {
  defaultPassword: string;
}
