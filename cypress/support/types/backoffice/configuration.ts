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

export interface ConfigurationManagementStaticFixtures {
  defaultPassword: string;
  themeSettings: {
    mainColorKey: string;
    altColorKey: string;
    mainColorDefault: string;
    validColor: string;
    invalidColor: string;
  };
  searchTerm: string;
}

export interface ConfigurationManagementDynamicFixtures {
  rootUser: User;
}
