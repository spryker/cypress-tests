import { Customer, ProductConcrete } from './shared';

export interface WishlistManagementStaticFixtures {
  defaultPassword: string;
}

export interface WishlistManagementDynamicFixtures {
  customer: Customer;
  product: ProductConcrete;
}
