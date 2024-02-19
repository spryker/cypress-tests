import {User} from "./user";

interface Customer {
    password: string;
}

export interface CheckoutByGuestCustomerFixtures {
    concreteProductSkus: string[];
}

export interface CheckoutByLoggedInCustomerFixtures {
    concreteProductSkus: string[];
    customer: Customer;
}

export interface BackofficeMerchantAgentFixtures {
    user: User;
    customerAgentUser: User;
    merchantAgentUser: User;
}

export interface MerchantPortalAgentLoginFixtures {
    customerAgentUser: User;
    merchantAgentUser: User;
    merchantUser: User;
}

export interface CreateOrderByCustomerFixtures {
    concreteProductSkus: string[];
    customer: Customer;
}

export interface CreateOrderByGuestFixtures {
    concreteProductSkus: string[];
}

export interface CreateReturnByUserFixtures {
    user: User;
}
