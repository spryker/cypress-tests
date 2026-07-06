import { injectable } from 'inversify';
import { CategoryReSortRepository, SubCategoryPosition } from '../category-re-sort-repository';

@injectable()
export class B2bCategoryReSortRepository implements CategoryReSortRepository {
  private CATEGORY_LIST = '#category-list > .dd-list';

  private SUB_CATEGORY_SELECTORS: Record<SubCategoryPosition, string> = {
    first: `${this.CATEGORY_LIST} > li.dd-item:first-child`,
    second: `${this.CATEGORY_LIST} > li.dd-item:nth-child(2)`,
    last: `${this.CATEGORY_LIST} > li.dd-item:last-child`,
  };

  getCategoryList(): Cypress.Chainable {
    return cy.get(this.CATEGORY_LIST);
  }

  getSubCategorySelector(position: SubCategoryPosition): string {
    return this.SUB_CATEGORY_SELECTORS[position];
  }

  getSubCategory(position: SubCategoryPosition): Cypress.Chainable {
    return cy.get(this.getSubCategorySelector(position));
  }

  getSubCategoryHandle(position: SubCategoryPosition): Cypress.Chainable {
    return cy.get(`${this.getSubCategorySelector(position)} > .dd-handle`);
  }

  getSaveButton(): Cypress.Chainable {
    return cy.get('#save-button');
  }

  getAlertBox(): Cypress.Chainable {
    return cy.get('.swal2-container');
  }
}
