import { REPOSITORIES, autoWired, dragNestableItem } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { CategoryReSortRepository, SubCategoryPosition } from './category-re-sort-repository';

@injectable()
@autoWired
export class CategoryReSortPage extends BackofficePage {
  @inject(REPOSITORIES.CategoryReSortRepository) private repository: CategoryReSortRepository;

  // Time for the Zed JS bundle to attach the nestable drag handlers after the page loads.
  private WIDGET_INIT_MS = 2500;

  visitReSortPage = (idCategoryNode: number): void => {
    cy.visitBackoffice(`/category-gui/re-sort?id-node=${idCategoryNode}`);

    // The list markup renders server-side, but the jQuery-nestable widget that makes it draggable is
    // wired only after the large Zed JS bundle finishes parsing. Dragging before that binds is a
    // silent no-op. Nestable exposes no Cypress-readable ready signal (its instance lives in the
    // app jQuery's private data cache), so settle briefly to let the bundle attach the handlers.
    // eslint-disable-next-line cypress/no-unnecessary-waiting -- No observable ready signal on the nestable widget; see above.
    cy.wait(this.WIDGET_INIT_MS);
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
