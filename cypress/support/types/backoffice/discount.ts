import { User } from './shared';

export interface Discount {
  id_discount: number;
  display_name: string;
}

export interface DiscountCreateStaticFixtures {
  defaultPassword: string;
}

export interface DiscountCreateDynamicFixtures {
  rootUser: User;
}

export interface DiscountListStaticFixtures {
  defaultPassword: string;
}

export interface DiscountListDynamicFixtures {
  rootUser: User;
  discount: Discount;
}

export interface DiscountCustomerGroupSuggestStaticFixtures {
  defaultPassword: string;
}

export interface DiscountCustomerGroupSuggestDynamicFixtures {
  rootUser: User;
  customerGroup: { name: string };
  discountWithMissingCustomerGroups: Discount;
}
