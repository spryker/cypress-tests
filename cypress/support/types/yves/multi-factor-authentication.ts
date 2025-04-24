import { Customer, User } from './shared';

export interface CustomerMfaAuthDynamicFixtures {
  customerOne: Customer;
  customerTwo: Customer;
  customerThree: Customer;
  customerFour: Customer;
}

export interface CustomerMfaAuthStaticFixtures {
  defaultPassword: string;
  newPassword: string;
  invalidCode: string;
}

export interface AgentMfaAuthDynamicFixtures {
  agentOne: User;
  agentTwo: User;
}

export interface AgentMfaAuthStaticFixtures {
  defaultPassword: string;
  invalidCode: string;
}

