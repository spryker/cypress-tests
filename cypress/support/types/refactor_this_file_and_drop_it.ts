
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

type MerchantUserAgentDashboardFixtures = {
    merchantAgentUser: User;
    backofficeUser: User;
};

type MerchantUserImpersonationFixtures = {
    merchantAgentUser: User;
    backofficeUser: User;
    merchantUsername: string;
    productConcreteSkus: string[];
    productAbstractSku: string;
    offerReference: string;
};

type MerchantUserHeaderBarFixtures = {
    merchantAgentUser: User;
    impersonatedMerchantName: string;
    impersonatedMerchantUser: MerchantUser;
};

type MerchantUser = {

};


export interface User {
    username: string;
    password: string;
}
export interface Guest {
    firstName: string;
    lastName: string;
    email: string;
}
