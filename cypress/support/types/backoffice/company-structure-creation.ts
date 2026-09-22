import { User } from './shared';

export interface CompanyStructureCreationStaticFixtures {
  defaultPassword: string;
  seeCompanyUsersPermissionName: string;
  companyUserPagePath: string;
  companyRolePagePath: string;
}

export interface CompanyStructureCreationDynamicFixtures {
  rootUser: User;
  agentUser: User;
}
