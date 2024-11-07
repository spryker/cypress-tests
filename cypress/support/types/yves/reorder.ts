import { Address, Customer, Merchant, ProductConcrete, ProductOptionValue } from './shared';

export interface ReorderConcreteProductsDynamicFixtures {
  customer1: Customer;
  address1: Address;

  customer2: Customer;
  address2: Address;

  customer3: Customer;
  address3: Address;

  customer4: Customer;
  address4: Address;

  product1: ProductConcrete;
  product2: ProductConcrete;

  productOptionValue: ProductOptionValue;
}

export interface ReorderProductBundlesDynamicFixtures {
  customer: Customer;
  address: Address;
  productBundle: ProductConcrete;
}

export interface ReorderProductOffersDynamicFixtures {
  customer: Customer;
  address: Address;
  merchant1: Merchant;
  merchant2: Merchant;
  product1: ProductConcrete;
  product2: ProductConcrete;
}

export interface ReorderRandomWeightProductsDynamicFixtures {
  customer: Customer;
  address: Address;
  productMUnit: ProductConcrete;
  productPUnit: ProductConcrete;
}

export interface ReorderStaticFixtures {
  defaultPassword: string;
}
