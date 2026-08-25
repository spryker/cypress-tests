import { Customer, ProductConcrete } from './shared';

export interface WishlistManagementDynamicFixtures {
  customer: Customer;
  product1: ProductConcrete;
  product2: ProductConcrete;
}

export interface WishlistManagementStaticFixtures {
  defaultPassword: string;
  defaultWishlistName: string;
  secondWishlistName: string;
}
