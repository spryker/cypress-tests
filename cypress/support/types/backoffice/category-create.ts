import { User } from './shared';

export interface CategoryCreateStaticFixtures {
  defaultPassword: string;
}

export interface CategoryCreateDynamicFixtures {
  rootUser: User;
  parentCategory: CategoryCreateCategory;
}

interface CategoryCreateCategory {
  id_category: number;
}
