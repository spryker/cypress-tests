import { Store, User } from './shared';
import { Category } from './shared/category';

export interface CategoryEditStaticFixtures {
  childCategoryName: string;
  defaultPassword: string;
  helpText: string;
  parentCategoryName: string;
  rootUser: User;
  storeNameToUnassign: string;
}

export interface CategoryEditDynamicFixtures {
  store: Store;
  parentCategory: Category;
  childCategory: Category;
}
