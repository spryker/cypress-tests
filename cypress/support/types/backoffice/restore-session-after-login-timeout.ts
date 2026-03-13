import { User } from './shared';

export interface RestoreSessionAfterLoginTimeoutDynamicFixtures {
  rootUser: User;
}

export interface RestoreSessionAfterLoginTimeoutStaticFixtures {
  defaultPassword: string;
  lastVisitedPageUrl: string;
}
