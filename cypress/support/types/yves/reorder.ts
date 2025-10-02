import { Address, Customer, Merchant, ProductConcrete, ProductOptionValue } from './shared';

export interface ReorderConcreteProductsDynamicFixtures {
  customer1: Customer;
  customer2: Customer;
  customer3: Customer;
  customer4: Customer;

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

export interface ReorderProductOfferStaticFixtures {
  defaultPassword: string;
  soldByText: string;
}
