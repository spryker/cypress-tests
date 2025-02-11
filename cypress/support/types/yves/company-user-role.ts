import { Customer, CompanyRole, User } from './shared';

export interface CompanyUserRoleDynamicFixtures {
  customer: Customer;
  user: User;
  companyRole: CompanyRole;
}

export interface CompanyUserRoleStaticFixtures {
  defaultPassword: string;
}
