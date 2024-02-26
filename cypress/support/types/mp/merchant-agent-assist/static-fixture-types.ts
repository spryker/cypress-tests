export interface CustomerAgentLoginPageStaticFixtures {
  rootUser: User;
  merchantAgentUser: User;
  customerAgentUser: User;
  merchantUser: User;
}

interface User {
  username: string;
  password: string;
}
