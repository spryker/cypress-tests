import { Customer, Merchant, ProductConcrete, ProductOffer, User } from './transfer/transfer-types';

export interface MarketplaceAgentAssistSuite1DynamicFixtures {
  rootUser: User;
  merchantAgentUser: User;
  customerAgentUser: User;
  merchant: Merchant;
  merchantUser: User;
  deletedMerchantUser: User;
  deactivatedMerchantUser: User;
  merchantUserFromActiveDeniedMerchant: User;
  merchantUserFromInactiveApprovedMerchant: User;
  merchantUserFromInactiveDeniedMerchant: User;
}

export interface MarketplaceAgentAssistSuite2DynamicFixtures {
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
