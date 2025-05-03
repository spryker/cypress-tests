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
  invalidCode: string;
}
