export interface RootUser {
  username: string;
  id_user: number;
}

export interface MerchantRegistrationDynamicFixtures {
  rootUser: RootUser;
}

export interface MerchantRegistrationStaticFixtures {
  defaultCountry: string;
  defaultPassword: string;
  merchantUserPassword: string;
}
