import { User } from './shared';

export interface NavigationSmokeStaticFixtures {
  defaultPassword: string;
  accessDeniedUrlPart: string;
}

export interface NavigationSmokeDynamicFixtures {
  rootUser: User;
}
