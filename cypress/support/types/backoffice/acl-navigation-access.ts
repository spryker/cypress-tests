import { User } from './shared';

export interface AclUserScenarioFixture {
  password: string;
  expectedMenuItems: string[];
  allowedPaths: string[];
  deniedPaths: string[];
}

export interface AclNavigationAccessStaticFixtures {
  restrictedUser: AclUserScenarioFixture;
  combinedUser: AclUserScenarioFixture;
}

export interface AclNavigationAccessDynamicFixtures {
  restrictedUser: User;
  combinedUser: User;
}
