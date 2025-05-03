import { User } from './shared';

export interface SspFileManagementStaticFixtures {
  defaultPassword: string;
  assetPrompt: string;
  companyPrompt: string;
  companyUserPrompt: string;
  companyBusinessUnitPrompt: string;
}

export interface SspFileManagementDynamicFixtures {
  rootUser: User;
}
