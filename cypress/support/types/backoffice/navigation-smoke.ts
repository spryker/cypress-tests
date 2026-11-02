import { User } from './shared';

export interface NavigationSmokeStaticFixtures {
  defaultPassword: string;
  accessDeniedUrlPart: string;
  menuFilterTerm: string;
}

export interface NavigationSmokeDynamicFixtures {
  rootUser: User;
}
