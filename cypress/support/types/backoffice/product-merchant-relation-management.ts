import { User, Product, Merchant } from './shared';

export interface ProductMerchantRelationManagementStaticFixtures {
  defaultPassword: string;
}

export interface ProductMerchantRelationManagementDynamicFixtures {
  rootUser: User;
  product: Product;
  productWithMerchant: Product;
  merchant: Merchant;
  anotherMerchant: Merchant;
}
