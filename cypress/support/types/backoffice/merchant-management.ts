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

export interface OfferViewAndFilterDynamicFixtures {
  rootUser: User;
  merchant1: Merchant;
  merchant2: Merchant;
  merchantProduct1: ProductConcrete;
  merchantProduct2: ProductConcrete;
  productOffer1: ProductOffer;
  productOffer2: ProductOffer;
}

export interface OfferViewAndFilterStaticFixtures {
  defaultPassword: string;
}
