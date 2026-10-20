import { Customer, User } from './shared';

export interface CompanyStructureCreationStaticFixtures {
  defaultPassword: string;
  restrictedRoleName: string;
  companyUserPagePath: string;
  companyRolePagePath: string;
}

export interface CompanyStructureCreationDynamicFixtures {
  adminCustomer: Customer;
  agentUser: User;
}
