import { User } from './shared';

export interface UserMfaAuthDynamicFixtures {
  rootUserOne: User;
  rootUserTwo: User;
  rootUserThree: User;
  rootUserFour: User;
}

export interface UserMfaAuthStaticFixtures {
  defaultPassword: string;
  invalidCode: string;
  newPassword: string;
}
