import { User, Stock } from './shared';

export interface MerchantCombinedProductDynamicFixtures {
  rootUser: User;
  merchantUser: User;
}

export interface MerchantCombinedProductOfferDynamicFixtures {
  rootUser: User;
  merchantUser: User;
  stock: Stock;
}

export interface MerchantCombinedProductStaticFixtures {
  defaultPassword: string;
}

export interface MerchantCombinedProductOfferStaticFixtures {
  defaultPassword: string;
}
