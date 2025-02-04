import {Customer, Store} from './shared';

export interface ClaimDynamicFixtures {
    customer: Customer;
}

export interface ClaimStaticFixtures {
    defaultPassword: string;
    claim: Claim
}

export interface Claim{
    subject: string;
    description: string;
    files: string[];
    availableTypes: string[];
}
