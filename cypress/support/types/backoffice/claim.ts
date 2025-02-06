import { User } from './shared';

export interface ClaimStaticFixtures {
    defaultPassword: string;
    rootUser: User;
}

export interface ClaimDynamicFixtures {
    generalClaim: Claim,
    orderClaim: OrderClaim,
    customer: Customer,
    company: Company;
    businessUnit: BusinessUnit;
}

export interface Claim {
    id_claim: number;
    reference: string;
    subject: string;
    description: string;
    status: string;
    type: string;
    store: Store;
    files: File;
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

export interface Store {
    name: string;
}

export interface File {
    file_name: string;
    file_info: FileInfo[];
}

export interface FileInfo {
    extension: string;
    size: number;
}

export interface OrderClaim extends Claim {
    order: Order;
}

export interface Order {
    order_reference: string;
}
