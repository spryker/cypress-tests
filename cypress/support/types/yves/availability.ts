import { Address, Customer, ProductConcrete } from './shared';

export interface AvailabilityCheckoutDynamicFixtures {
  customer1: Customer;
  customer2: Customer;
  address: Address;
  product: ProductConcrete;
}

export interface AvailabilityCheckoutStaticFixtures {
  defaultPassword: string;
  availableStock: number;
}
