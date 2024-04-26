import { Customer } from './shared';

export interface CustomerAuthDynamicFixtures {
  customer: Customer;
}

export interface CustomerAuthStaticFixtures {
  defaultPassword: string;
}

export interface CustomerAuthSmokeStaticFixtures {
  defaultPassword: string;
  customer: Customer;
}
