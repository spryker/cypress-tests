import { Customer, Merchant, ProductConcrete, ProductOffer, User } from './shared';

export interface AgentAuthorizationDynamicFixtures {
  merchantAgentUser: User;
  customerAgentUser: User;
  merchantUser: User;
}

export interface AgentDashboardDynamicFixtures {
  rootUser: User;
  merchantAgentUser: User;
  merchant: Merchant;
  merchantUser: User;
  deletedMerchantUser: User;
  deactivatedMerchantUser: User;
  merchantUserFromActiveDeniedMerchant: User;
  merchantUserFromInactiveApprovedMerchant: User;
  merchantUserFromInactiveDeniedMerchant: User;
}

export interface AgentLoginDynamicFixtures {
  merchantAgentUser: User;
  customerAgentUser: User;
  merchantUser: User;
  deletedMerchantUser: User;
  deactivatedMerchantUser: User;
}

export interface AgentImpersonationDynamicFixtures {
  merchantAgentUser: User;
  merchant: Merchant;
  merchantUser: User;
}

export interface AgentPermissionDynamicFixtures {
  rootUser: User;
  merchantAgentUser: User;
  customerAgentUser: User;
}

export interface AgentMerchantPortalDynamicFixtures {
  rootUser: User;
  merchantAgentUser: User;
  merchantUser: User;
  customer: Customer;
  productConcreteForOffer: ProductConcrete;
  productConcreteForMerchant: ProductConcrete;
  productOffer: ProductOffer;
}

export interface MarketplaceAgentAssistStaticFixtures {
  defaultPassword: string;
}
