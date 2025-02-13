import {Customer, User} from './shared';

export interface ManageCompanyUserDynamicFixtures {
    customer: Customer;
    customer2: Customer;
    user: User;
}

export interface ManageCompanyUserRoleStaticFixtures {
    defaultPassword: string;
}
