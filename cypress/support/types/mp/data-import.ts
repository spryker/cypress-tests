import { User, Merchant, ProductConcrete, Customer } from './shared';

export interface MerchantCombinedProductDynamicFixtures {
  rootUser: User;
  merchantUser: User;
  merchant: Merchant;
  customer: Customer;
}

export interface MerchantCombinedProductOfferDynamicFixtures {
  rootUser: User;
  merchantUser: User;
  merchant: Merchant;
  product: ProductConcrete;
  customer: Customer;
}

export interface MerchantCombinedProductStaticFixtures {
  defaultPassword: string;
}

export interface MerchantCombinedProductOfferStaticFixtures {
  defaultPassword: string;
}
