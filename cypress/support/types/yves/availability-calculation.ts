import { Address, Customer, ProductConcrete, User } from './shared';

export interface AvailabilityCalculationStaticFixtures {
  defaultPassword: string;
  initialStock: number;
  orderedQuantity: number;
}

export interface AvailabilityCalculationDynamicFixtures {
  rootUser: User;
  orderingCustomer: Customer;

  // A second customer whose cart already holds the product, so the reservation is read from a cart
  // the order did not consume.
  cartCustomer: Customer;
  address: Address;
  product: ProductConcrete;
}
