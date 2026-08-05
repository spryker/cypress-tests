import { REPOSITORIES, autoWired, dragNestableItem, waitForNestableInit } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { CategoryReSortRepository, SubCategoryPosition } from './category-re-sort-repository';

@injectable()
@autoWired
export class CategoryReSortPage extends BackofficePage {
  @inject(REPOSITORIES.CategoryReSortRepository) private repository: CategoryReSortRepository;

  visitReSortPage = (idCategoryNode: number): void => {
    cy.visitBackoffice(`/category-gui/re-sort?id-node=${idCategoryNode}`);
    waitForNestableInit();
  };

  getCategoryList = (): Cypress.Chainable => this.repository.getCategoryList();

  getSubCategory = (position: SubCategoryPosition): Cypress.Chainable => this.repository.getSubCategory(position);

  getSubCategoryHandle = (position: SubCategoryPosition): Cypress.Chainable =>
    this.repository.getSubCategoryHandle(position);

  getSubCategoryName = (position: SubCategoryPosition): Cypress.Chainable<string> =>
    this.repository
      .getSubCategoryHandle(position)
      .invoke('text')
      .then((text) => text.trim());

  save = (): void => {
    this.repository.getSaveButton().click();
  };

  getAlertBox = (): Cypress.Chainable => this.repository.getAlertBox();

  reorder = (from: SubCategoryPosition, to: SubCategoryPosition): void => {
    dragNestableItem({
      listSelector: this.repository.getNestableContainerSelector(),
      fromItemSelector: this.repository.getSubCategorySelector(from),
      toItemSelector: this.repository.getSubCategorySelector(to),
    });
  };
}
