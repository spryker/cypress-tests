import { Customer, Store, User } from './shared';

export interface CompanyRoleDynamicFixtures {
  customer: Customer;
  user: User;
}

export interface CompanyRoleStaticFixtures {
  defaultPassword: string;
}
