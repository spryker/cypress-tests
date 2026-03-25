import { User } from './shared';

export interface ConfigurationStaticFixtures {
  defaultPassword: string;
  testColor: string;
  defaultColors: {
    themeMainColor: string;
    themeAltColor: string;
    backofficeColor: string;
    merchantPortalColor: string;
  };
}

export interface ConfigurationDynamicFixtures {
  rootUser: User;
}
