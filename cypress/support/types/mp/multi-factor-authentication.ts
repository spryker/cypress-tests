import { Merchant, User } from './shared';

export interface MerchantUserMfaAuthDynamicFixtures {
  merchantOne: Merchant;
  merchantUserOne: User;
  merchantTwo: Merchant;
  merchantUserTwo: User;
}

export interface MerchantUserMfaAuthStaticFixtures {
  defaultPassword: string;
  invalidCode: string;
  newPassword: string;
}

export interface MerchantAgentMfaAuthDynamicFixtures {
  merchantAgentUserOne: User;
  merchantUserOne: User;
  merchantAgentUserTwo: User;
  merchantUserTwo: User;
}

export interface MerchantAgentMfaAuthStaticFixtures {
  defaultPassword: string;
  invalidCode: string;
}
