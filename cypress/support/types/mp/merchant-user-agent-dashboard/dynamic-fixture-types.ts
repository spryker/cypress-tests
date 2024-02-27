export interface MerchantUserAgentDashboardDynamicFixtures {
  rootUser: User;
  merchantAgentUser: User;
  merchantUser: User;
  merchant: Merchant;
}

interface User {
  username: string;
  first_name: string;
  last_name: string;
}

interface Merchant {
  name: string;
}
