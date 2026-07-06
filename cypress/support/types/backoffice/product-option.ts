import { User } from './shared';

export interface ProductOptionManagementStaticFixtures {
  defaultPassword: string;
}

export interface ProductOptionManagementDynamicFixtures {
  rootUser: User;
  productOptionGroup: ProductOptionGroup;
}

export interface ProductOptionGroup {
  id_product_option_group: number;
}
