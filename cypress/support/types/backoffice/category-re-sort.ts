import { User } from './shared';

export interface CategoryReSortStaticFixtures {
  defaultPassword: string;
}

export interface CategoryReSortDynamicFixtures {
  rootUser: User;
  parentCategory: CategoryReSortParentCategory;
}

interface CategoryReSortParentCategory {
  id_category: number;
  category_node: CategoryReSortCategoryNode;
}

interface CategoryReSortCategoryNode {
  id_category_node: number;
}
