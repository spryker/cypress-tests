import { Customer, ProductConcrete } from './shared';

export interface ProductRestrictionsStaticFixtures {
  defaultPassword: string;
}

export interface ProductRestrictionsDynamicFixtures {
  // Each customer has a business unit of its own, so the lists scoped to their merchant relationships
  // narrow no catalog another spec browses.
  whitelistedCustomer: Customer;
  blacklistedCustomer: Customer;
  unrestrictedCustomer: Customer;
  allowedProduct: ProductConcrete;
  hiddenProduct: ProductConcrete;
}
