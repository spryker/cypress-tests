export interface AgentPermissionInBackofficeDynamicFixtures {
  rootUser: User;
  merchantAgentUser: User;
  customerAgentUser: User;
}

interface User {
  username: string;
}