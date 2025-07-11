import { Address, Customer, ProductConcrete, User } from './shared';

export interface OrderAmendmentCancelDynamicFixtures {
  customer: Customer;
  address: Address;
  product: ProductConcrete;
}

export interface OrderAmendmentFinishDynamicFixtures {
  rootUser: User;

  customer1: Customer;
  address1: Address;

  customer2: Customer;
  address2: Address;

  customer3: Customer;
  address3: Address;
  address3new: Address;

  customer4: Customer;
  address4: Address;

  customer5: Customer;
  address5: Address;

  product1: ProductConcrete;
  product2: ProductConcrete;
  product3: ProductConcrete;
  product4: ProductConcrete;
}

export interface OrderAmendmentStartDynamicFixtures {
  rootUser: User;

  customer1: Customer;
  address1: Address;

  customer2: Customer;
  address2: Address;

  customer3: Customer;
  address3: Address;

  customer4: Customer;
  address4: Address;

  customer5: Customer;
  address5: Address;

  customer6: Customer;
  address6: Address;

  customer7: Customer;
  address7: Address;

  customer8: Customer;
  address8: Address;

  product: ProductConcrete;
  productInActive: ProductConcrete;
  productOutOfStock: ProductConcrete;
  productOutOfStock2: ProductConcrete;
}

export interface OrderAmendmentStaticFixtures {
  defaultPassword: string;
  oldProductPrice: string;
  newProductPrice: string;
  paymentMethodCreditCard: string;
  paymentMethodInvoice: string;
}
