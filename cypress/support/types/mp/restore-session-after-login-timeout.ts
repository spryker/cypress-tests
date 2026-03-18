import { User } from './shared';

export interface RestoreSessionAfterLoginTimeoutDynamicFixtures {
  merchantUser: User;
}

export interface RestoreSessionAfterLoginTimeoutStaticFixtures {
  defaultPassword: string;
  lastVisitedPageUrl: string;
}
