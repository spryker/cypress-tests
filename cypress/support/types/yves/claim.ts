import {Customer, Store} from './shared';

export interface ClaimDynamicFixtures {
    customer: Customer;
    order: Order;
}

export interface ClaimStaticFixtures {
    defaultPassword: string;
    claim: Claim;
    claimTypes: ClaimTypes;
}

export interface Claim {
    subject: string;
    description: string;
    files: string[];
    availableTypes: string[];
}

export interface Order {
    id_sales_order: number;
    order_reference: string;
}

export interface ClaimTypes {
    general: string[];
    order: string[];
}
