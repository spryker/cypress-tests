import { ProductConcrete } from './shared';

export interface ProductRestrictionsStaticFixtures {
  defaultPassword: string;

  // A customer whose company business unit sits in the merchant relationship the whitelist is scoped
  // to, one whose business unit sits in the relationship the blacklist is scoped to, and one in neither.
  whitelistedCustomer: StaticCustomer;
  blacklistedCustomer: StaticCustomer;
  unrestrictedCustomer: StaticCustomer;
}

interface StaticCustomer {
  email: string;
}

export interface ProductRestrictionsDynamicFixtures {
  allowedProduct: ProductConcrete;
  hiddenProduct: ProductConcrete;
}
