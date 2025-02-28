import { Customer, CompanyRole, CompanyUser, User } from './shared';

export interface CompanyRoleDynamicFixtures {
  customer: Customer;
  user: User;
  companyRole: CompanyRole;
  companyUser: CompanyUser;
}

export interface CompanyRoleStaticFixtures {
  defaultPassword: string;
}
