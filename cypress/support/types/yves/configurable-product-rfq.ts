import { Address, Customer, ProductConcrete, User } from './shared';

export interface ConfigurableProductRfqStaticFixtures {
  defaultPassword: string;
  configurationNotCompleteStatus: string;
  configurationCompleteStatus: string;
}

export interface ConfigurableProductRfqDynamicFixtures {
  customer: Customer;
  address: Address;
  companyUser: RfqCompanyUser;
  agentUser: User;
  product: ProductConcrete;
}

interface RfqCompanyUser {
  id_company_user: number;
}
