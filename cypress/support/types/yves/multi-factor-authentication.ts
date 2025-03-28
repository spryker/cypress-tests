import { Customer } from './shared';

export interface CustomerMfaAuthDynamicFixtures {
    customerOne: Customer;
    customerTwo: Customer;
    customerThree: Customer;
}

export interface CustomerMfaAuthStaticFixtures {
    defaultPassword: string;
}
