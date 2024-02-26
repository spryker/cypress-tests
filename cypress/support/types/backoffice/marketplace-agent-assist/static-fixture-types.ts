export interface StaticFixtures {
  rootUser: User;
  merchantAgentUser: User;
  customerAgentUser: User;
}

interface User {
  username: string;
  password: string;
}
