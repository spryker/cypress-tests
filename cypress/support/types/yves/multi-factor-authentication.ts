import { Customer } from './shared';

export interface CustomerMfaAuthDynamicFixtures {
  customerOne: Customer;
  customerTwo: Customer;
  customerThree: Customer;
  customerFour: Customer;
}

export interface CustomerMfaAuthStaticFixtures {
  defaultPassword: string;
  newPassword: string;
  activationSuccessMessage: string;
  deactivationSuccessMessage: string;
  invalidCodeMessage: string;
  passwordChangeSuccessMessage: string;
  invalidCode: string;
}
