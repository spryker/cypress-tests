import { Customer, ProductConcrete, User } from './shared';

export interface ConfigurableProductBasisStaticFixtures {
  defaultPassword: string;
  configuratorKey: string;
  fileName: string;
  savedMessage: string;
  chosenOptionTitle: string;
  configurationCompleteStatus: string;
}

export interface ConfigurableProductBasisDynamicFixtures {
  rootUser: User;
  customer: Customer;
  product: ProductConcrete;
}
