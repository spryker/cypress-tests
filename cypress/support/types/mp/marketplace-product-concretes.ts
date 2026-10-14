import { Customer, Merchant, ProductConcrete, User } from './shared';

export interface ProductConcreteManagementDynamicFixtures {
  rootUser: User;
  merchant: Merchant;
  merchantUser: User;
  approvalMerchant: Merchant;
  customer?: Customer;

  concreteProduct1: ProductConcrete;
  concreteProduct2: ProductConcrete;
  pendingProduct: ProductConcrete;
}

export interface ProductConcreteManagementStaticFixtures {
  defaultPassword: string;
  createdProduct: CreatedProduct;
  pendingProductPrice: string;
}

interface CreatedProduct {
  attributeName: string;
  attributeValues: string[];
}

export interface MerchantProductManagementDynamicFixtures {
  merchant: Merchant;
  merchantUser: User;
  variantProduct: ProductConcrete;
}

export interface MerchantProductManagementStaticFixtures {
  defaultPassword: string;
  variantAttributeKey: string;
  addedConcrete: AddedConcrete;
}

interface AddedConcrete {
  attributeValue: string;
  stockQuantity: number;
  searchableLocales: string[];
}
