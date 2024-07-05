import { Address, Customer, Merchant, ProductConcrete, User } from './shared';

export interface CommissionCalculationDynamicFixtures {
  rootUser: User;
  merchant1: Merchant;
  merchantUserFromMerchant1: User;
  merchant2: Merchant;
  merchantUserFromMerchant2: User;
  concreteProduct1: ProductConcrete;
  concreteProduct2: ProductConcrete;
  concreteProduct3: ProductConcrete;
  concreteProduct4: ProductConcrete; // product without category assigment
  concreteProduct5: ProductConcrete; // product from merchant that is not part of item conditions
  customer: Customer;
  address: Address;
}

export interface CommissionCalculationStaticFixtures {
  defaultPassword: string;
  totalCommission: string;
  merchant1TotalCommission: string;
  merchant2TotalCommission: string;
}
