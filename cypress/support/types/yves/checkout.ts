import { Address, Customer, ProductConcrete, Quote, User } from './shared';
import { Store } from '../smoke/shared';

export interface BasicCheckoutDynamicFixtures {
  customer: Customer;
  address: Address;
  product1: ProductConcrete;
  product2: ProductConcrete;
  quote1: Quote;
  quote2: Quote;
  quote3: Quote;
  quote4: Quote;
}

export interface CheckoutStaticFixtures {
  customer: Customer;
  defaultPassword: string;
  paymentMethods: Array<string>;
  product1: ProductConcrete;
  product2: ProductConcrete;
  productPrice: string;
  rootUser: User;
  shipmentMethods: Array<string>;
  store: Store;
  warehouse: string;
}
