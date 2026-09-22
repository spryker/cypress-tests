import { Customer, ProductConcrete } from './shared';

export interface PackagingUnitCheckoutStaticFixtures {
  defaultPassword: string;

  // An amount below the minimum and off the interval, and one that satisfies both.
  rejectedAmount: number;
  acceptedAmount: number;
}

export interface PackagingUnitCheckoutDynamicFixtures {
  customer: Customer;
  product: ProductConcrete;
}
