import { Merchant, ProductConcrete, ProductOffer, Url, User } from '../mp/shared';

export interface MerchantDeactivationDynamicFixtures {
  rootUser: User;
  merchantUser: User;
  merchant: Merchant;
  merchantUrlEN: Url;
  merchantProduct: ProductConcrete;
}

export interface MerchantDeactivationStaticFixtures {
  defaultPassword: string;
}

export interface MerchantCrudDynamicFixtures {
  rootUser: User;
}

export interface MerchantCrudStaticFixtures {
  defaultPassword: string;
}

export interface OfferApprovalDynamicFixtures {
  rootUser: User;
  merchant: Merchant;
  merchantProduct: ProductConcrete;
  productOffer: ProductOffer;
}

export interface OfferApprovalStaticFixtures {
  defaultPassword: string;
}
