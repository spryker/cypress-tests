import { Customer, CompanyRole, User } from './shared';

export interface CompanyRoleDynamicFixtures {
  customer: Customer;
  user: User;
  companyRole: CompanyRole;
}

export interface CompanyRoleStaticFixtures {
  defaultPassword: string;
}
