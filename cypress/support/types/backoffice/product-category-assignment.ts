import { User } from './shared';

export interface ProductCategoryAssignmentStaticFixtures {
  defaultPassword: string;
}

export interface ProductCategoryAssignmentDynamicFixtures {
  rootUser: User;
  category: ProductCategoryAssignmentCategory;
  productToAssign: ProductCategoryAssignmentProduct;
  productToDeassign: ProductCategoryAssignmentProduct;
}

interface ProductCategoryAssignmentCategory {
  id_category: number;
}

interface ProductCategoryAssignmentProduct {
  fk_product_abstract: number;
  abstract_sku: string;
}
