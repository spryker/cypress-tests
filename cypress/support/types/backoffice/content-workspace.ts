import { User } from './shared';

export interface ContentWorkspaceStaticFixtures {
  defaultPassword: string;
  sharedContentItemKey: string;
}

export interface ContentWorkspaceDynamicFixtures {
  rootUser: User;
}
