export interface MerchantUserAgentDashboardDynamicFixtures {
  rootUser: User;
  merchantAgentUser: User;
  merchantUser: User;
  merchant: Merchant;
}

interface User {
  username: string;
}

interface Merchant {
  name: string;
}
