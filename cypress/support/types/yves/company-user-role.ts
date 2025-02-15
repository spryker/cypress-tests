import { Customer, CompanyRole, CompanyUser, User } from './shared';

export interface CompanyUserRoleDynamicFixtures {
  customer: Customer;
  user: User;
  companyRole: CompanyRole;
  companyUser: CompanyUser;
}

export interface CompanyUserRoleStaticFixtures {
  defaultPassword: string;
}
