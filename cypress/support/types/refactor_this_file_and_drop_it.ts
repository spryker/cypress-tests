
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



export interface User {
    username: string;
    password: string;
}
