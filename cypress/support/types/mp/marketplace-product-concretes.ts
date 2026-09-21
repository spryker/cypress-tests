import { Merchant, ProductConcrete, User } from './shared';

export interface ProductConcreteManagementDynamicFixtures {
  rootUser: User;
  merchant: Merchant;
  merchantUser: User;

  concreteProduct1: ProductConcrete;
  concreteProduct2: ProductConcrete;
}

export interface ProductConcreteManagementStaticFixtures {
  defaultPassword: string;
  storeName: string;
  currency: string;
  createdProduct: CreatedProduct;
}

interface CreatedProduct {
  attributeName: string;
  attributeValues: string[];
  netAmount: number;
  grossAmount: number;
  displayedPrice: string;
  stockQuantity: number;
  searchableLocales: string[];
}
