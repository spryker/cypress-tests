import { Customer, User } from './shared';

export interface UserMfaAuthDynamicFixtures {
  rootUserOne: User;
  rootUserTwo: User;
  rootUserThree: User;
  rootUserFour: User;
  rootUserFive: User;
  rootUserSix: User;
  customerOne: Customer;
}

export interface UserMfaAuthStaticFixtures {
  defaultPassword: string;
  invalidCode: string;
  newPassword: string;
}
