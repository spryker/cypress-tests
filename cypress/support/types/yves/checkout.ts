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
    rootUser: User;
}

export interface CheckoutStaticFixtures {
  customer: Customer;
  defaultPassword: string;
  paymentMethods: Array<PaymentMethod>;
  product1: ProductConcrete;
  product2: ProductConcrete;
  productPrice: string;
  shipmentMethods: Array<ShipmentMethod>;
  store: Store;
  warehouse: string;
}

export interface ShipmentMethod {
    key: string;
    name: string;
}

export interface PaymentMethod {
    key: string;
    name: string;
}
