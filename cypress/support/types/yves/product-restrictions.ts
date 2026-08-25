import { ProductConcrete } from './shared';

export interface ProductRestrictionsStaticFixtures {
  defaultPassword: string;

  // A customer whose company business unit sits in the merchant relationship the list is scoped to,
  // and one whose does not.
  restrictedCustomer: StaticCustomer;
  unrestrictedCustomer: StaticCustomer;
}

interface StaticCustomer {
  email: string;
}

export interface ProductRestrictionsDynamicFixtures {
  allowedProduct: ProductConcrete;
  hiddenProduct: ProductConcrete;
}
