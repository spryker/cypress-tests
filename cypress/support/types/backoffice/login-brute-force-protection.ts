import { User } from './shared';

export interface LoginBruteForceProtectionStaticFixtures {
  defaultPassword: string;
  wrongPassword: string;
  challengeAfterFailedAttempts: number;
  lockAfterFailedAttempts: number;
}

export interface UserLoginProtectionDynamicFixtures {
  challengeUser: User;
  captchaRejectionUser: User;
  lockUser: User;
}
