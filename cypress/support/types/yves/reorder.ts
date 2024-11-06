import { Address, Customer, ProductConcrete } from './shared';

export interface ReorderConcreteProductsDynamicFixtures {
  customer1: Customer;
  address1: Address;
  customer2: Customer;
  address2: Address;
  customer3: Customer;
  address3: Address;
  product1: ProductConcrete;
  product2: ProductConcrete;
}

export interface ReorderStaticFixtures {
  defaultPassword: string;
}
