import { User } from './shared';

export interface CompanyStructureCreationStaticFixtures {
  defaultPassword: string;
  companyUserRolePermissionNames: string[];
  companyUserPagePath: string;
  companyRolePagePath: string;
}

export interface CompanyStructureCreationDynamicFixtures {
  rootUser: User;
  agentUser: User;
}
