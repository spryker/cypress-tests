import { User } from './shared';

export interface LoginBruteForceProtectionStaticFixtures {
  defaultPassword: string;
  wrongPassword: string;
  challengeAfterFailedAttempts: number;
  lockAfterFailedAttempts: number;
}

export interface MerchantUserLoginProtectionDynamicFixtures {
  challengeMerchantUser: User;
  captchaRejectionMerchantUser: User;
  lockMerchantUser: User;
  doubleClickMerchantUser: User;
}

export interface MerchantAgentLoginProtectionDynamicFixtures {
  challengeMerchantAgent: User;
  captchaRejectionMerchantAgent: User;
  lockMerchantAgent: User;
  doubleClickMerchantAgent: User;
}
