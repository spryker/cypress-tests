import { Customer, ProductConcrete } from './shared';

export interface ProductRestrictionsStaticFixtures {
  defaultPassword: string;

  // A customer whose company business unit sits in the merchant relationship the blacklist is scoped
  // to, and one in no merchant relationship at all.
  blacklistedCustomer: StaticCustomer;
  unrestrictedCustomer: StaticCustomer;
}

interface StaticCustomer {
  email: string;
}

export interface ProductRestrictionsDynamicFixtures {
  // A customer of its own in the business unit the whitelist's merchant relationship is assigned to,
  // so the whitelist narrows no catalog another spec browses.
  whitelistedCustomer: Customer;
  allowedProduct: ProductConcrete;
  hiddenProduct: ProductConcrete;
}
