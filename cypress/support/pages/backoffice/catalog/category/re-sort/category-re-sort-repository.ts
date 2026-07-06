export type SubCategoryPosition = 'first' | 'second' | 'last';

export interface CategoryReSortRepository {
  getCategoryList(): Cypress.Chainable;
  getSubCategorySelector(position: SubCategoryPosition): string;
  getSubCategory(position: SubCategoryPosition): Cypress.Chainable;
  getSubCategoryHandle(position: SubCategoryPosition): Cypress.Chainable;
  getSaveButton(): Cypress.Chainable;
  getAlertBox(): Cypress.Chainable;
}
