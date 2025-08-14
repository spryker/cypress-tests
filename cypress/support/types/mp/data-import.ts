import { User } from './shared';

export interface MerchantCombinedProductDynamicFixtures {
  merchantUser: User;
}

export interface MerchantCombinedProductStaticFixtures {
  rootUser: User;
  defaultPassword: string;
}
