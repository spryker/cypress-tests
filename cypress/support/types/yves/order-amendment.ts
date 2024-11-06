import { Customer, Merchant, ProductConcrete, User } from './shared';

export interface OrderAmendmentCreationDynamicFixtures {
  rootUser: User;
  customer1: Customer;
  customer2: Customer;
  customer3: Customer;
  customer4: Customer;
  customer5: Customer;
  product: ProductConcrete;
}

export interface AmendRandomWeightProductsDynamicFixtures {
  rootUser: User;
  customer1: Customer;
  customer2: Customer;
  productMUnit: ProductConcrete;
  productPUnit: ProductConcrete;
}

export interface AmendProductOffersDynamicFixtures {
  customer: Customer;
  merchant1: Merchant;
  merchant2: Merchant;
  product1: ProductConcrete;
  product2: ProductConcrete;
}

export interface OrderAmendmentStaticFixtures {
  defaultPassword: string;
}
