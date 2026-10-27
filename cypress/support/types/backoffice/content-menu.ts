import { User } from './shared';

export interface ContentMenuStaticFixtures {
  defaultPassword: string;
  visibleMenuUrls: string[];
  legacyUrls: string[];
}

export interface ContentMenuDynamicFixtures {
  rootUser: User;
}
