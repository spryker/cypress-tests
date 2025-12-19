import { Store, User } from './shared';
import { Category } from './shared/category';

export interface CategoryEditStaticFixtures {
  defaultPassword: string;
  helpText: string;
  rootCategoryName: string;
  rootUser: User;
}

export interface CategoryEditDynamicFixtures {
  store: Store;
  parentCategory: Category;
  childCategory: Category;
}
