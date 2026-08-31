import { Customer, ProductConcrete, User } from './shared';

export interface ProductAttributeVisibilityStaticFixtures {
  defaultPassword: string;
  attributeKey: string;
  attributeValue: string;
  variantProduct: VariantProduct;
}

interface VariantProduct {
  url: string;
  selectedAttribute: SelectedAttribute;
  unselectedAttribute: UnselectedAttribute;
}

interface SelectedAttribute {
  key: string;
  allValues: string[];
  selectedValue: string;
  alternativeValue: string;
}

interface UnselectedAttribute {
  key: string;
  allValues: string[];
  combinableValues: string[];
  selectedValue: string;
}

export interface ProductAttributeVisibilityDynamicFixtures {
  rootUser: User;
  customer: Customer;
  product: ProductConcrete;
}
