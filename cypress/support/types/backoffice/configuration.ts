import { User } from './shared';

export interface ConfigurationStaticFixtures {
  defaultPassword: string;
  testColor: string;
  logoFilePath: string;
  cssVariables: {
    storefrontMainColor: string;
    backofficeMainColor: string;
    backofficeSidenavColor: string;
    backofficeSidenavTextColor: string;
    merchantPortalMainColor: string;
    backofficeLogoUrl: string;
    merchantPortalLogoFull: string;
  };
  defaultColors: {
    themeMainColor: string;
    themeAltColor: string;
    backofficeColor: string;
    backofficeSidenavColor: string;
    backofficeSidenavTextColor: string;
    merchantPortalColor: string;
  };
}

export interface ConfigurationDynamicFixtures {
  rootUser: User;
}
