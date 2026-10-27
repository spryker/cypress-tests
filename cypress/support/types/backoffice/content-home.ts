import { User } from './shared';

export interface ContentHomeStaticFixtures {
  defaultPassword: string;
  searchTerm: string;
  tooShortSearchTerm: string;
}

export interface ContentHomeDynamicFixtures {
  rootUser: User;
}
