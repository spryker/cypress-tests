import { Customer, User } from './shared';

export interface LoginBruteForceProtectionStaticFixtures {
  defaultPassword: string;
  wrongPassword: string;
  challengeAfterFailedAttempts: number;
  lockAfterFailedAttempts: number;
}

export interface CustomerLoginProtectionDynamicFixtures {
  challengeCustomer: Customer;
  captchaRejectionCustomer: Customer;
  lockCustomer: Customer;
  multiFactorAuthCustomer: Customer;
}

export interface AgentLoginProtectionDynamicFixtures {
  challengeAgent: User;
  captchaRejectionAgent: User;
  lockAgent: User;
}
