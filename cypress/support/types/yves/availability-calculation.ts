import { Address, Customer, ProductConcrete, User } from './shared';

export interface AvailabilityCalculationStaticFixtures {
  defaultPassword: string;
  initialStock: number;
  orderedQuantity: number;
}

export interface AvailabilityCalculationDynamicFixtures {
  rootUser: User;
  customer: Customer;
  address: Address;
  product: ProductConcrete;
}
