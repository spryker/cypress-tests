import { User } from './shared';

export interface ClaimStaticFixtures {
    defaultPassword: string;
    rootUser: User;
}

export interface ClaimDynamicFixtures {
    claim: Claim,
    customer: Customer,
    company: Company;
    businessUnit: BusinessUnit;
}

export interface Claim {
    id_claim: number;
    reference: string;
    subject: string;
    status: string;
    type: string;
}

export interface Customer {
    first_name: string;
    last_name: string;
    email: string;
    salutation: string;
}

export interface Company {
    name: string;
}

export interface BusinessUnit {
    name: string;
}
