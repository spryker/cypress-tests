import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { CategoryReSortRepository, SubCategoryPosition } from './category-re-sort-repository';

@injectable()
@autoWired
export class CategoryReSortPage extends BackofficePage {
  @inject(REPOSITORIES.CategoryReSortRepository) private repository: CategoryReSortRepository;

  private DRAG_STEPS = 12;

  // Time for the Zed JS bundle to attach the nestable drag handlers after the page loads.
  private WIDGET_INIT_MS = 2500;

  // Nestable commits the drop and reflows the list a tick after mouseup; a back-to-back second
  // reorder that reads element positions before that reflow lands on stale coordinates and misses.
  private DROP_SETTLE_MS = 500;

  visitReSortPage = (idCategoryNode: number): void => {
    cy.visitBackoffice(`/category-gui/re-sort?id-node=${idCategoryNode}`);
    this.repository.getCategoryList().should('be.visible');

    // The list markup renders server-side, but the jQuery-nestable widget that makes it draggable is
    // wired only after the large Zed JS bundle finishes parsing. Dragging before that binds is a
    // silent no-op. Nestable exposes no Cypress-readable ready signal (its instance lives in the
    // app jQuery's private data cache), so settle briefly to let the bundle attach the handlers.
    cy.wait(this.WIDGET_INIT_MS);
  };

  assertSubCategoryVisible = (position: SubCategoryPosition): void => {
    this.repository.getSubCategory(position).should('be.visible');
  };

  getSubCategoryName = (position: SubCategoryPosition): Cypress.Chainable<string> =>
    this.repository
      .getSubCategoryHandle(position)
      .invoke('text')
      .then((text) => text.trim());

  assertSubCategoryContains = (position: SubCategoryPosition, name: string): void => {
    // Cypress retries the assertion, so the re-render after a reorder settles without a fixed wait.
    this.repository.getSubCategoryHandle(position).should('contain', name);
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };

  assertSaveSuccess = (): void => {
    this.repository.getAlertBox().should('be.visible').and('contain', 'Success');
  };

  // Drag-reorder of the jQuery-nestable list (`.dd`). Nestable binds `mousedown` on the list and
  // `mousemove`/`mouseup` on the window, positioning by `e.pageX/e.pageY`. A constructed MouseEvent
  // can't set pageX/pageY (they're read-only), so we drive it with Cypress `.trigger`, which does.
  // The sequence: grab the handle (mousedown), a tiny initial move to arm the drag, stepped moves to
  // the target with a one-row overshoot so nestable commits the item past the target, then mouseup.
  reorder = (from: SubCategoryPosition, to: SubCategoryPosition): void => {
    const fromSelector = `${this.repository.getSubCategorySelector(from)} > .dd-handle`;
    const toSelector = this.repository.getSubCategorySelector(to);

    cy.get(fromSelector).then(($from) => {
      cy.get(toSelector).then(($to) => {
        const fromRect = $from[0].getBoundingClientRect();
        const toRect = $to[0].getBoundingClientRect();
        const scrollX = $from[0].ownerDocument.defaultView?.scrollX ?? 0;
        const scrollY = $from[0].ownerDocument.defaultView?.scrollY ?? 0;

        const startX = fromRect.left + fromRect.width / 2;
        const startY = fromRect.top + fromRect.height / 2;
        const endX = toRect.left + toRect.width / 2;
        // Nestable swaps as the cursor crosses each sibling's midpoint in the travel direction.
        // Dragging DOWN, landing on the target's centre crosses the items above it but stops before
        // the target itself. Dragging UP, the centre isn't crossed, so aim at the target's upper
        // quarter to cross its midpoint and land the item in the target's slot (mirrors Selenium's net).
        const draggingUp = toRect.top < fromRect.top;
        const endY = draggingUp ? toRect.top + toRect.height * 0.25 : toRect.top + toRect.height / 2;

        const at = (clientX: number, clientY: number) => ({
          which: 1,
          button: 0,
          clientX,
          clientY,
          pageX: clientX + scrollX,
          pageY: clientY + scrollY,
          force: true,
        });

        cy.get(fromSelector).trigger('mousedown', at(startX, startY));
        cy.get('body').trigger('mousemove', at(startX, startY + 2));
        for (let step = 1; step <= this.DRAG_STEPS; step += 1) {
          const x = startX + ((endX - startX) * step) / this.DRAG_STEPS;
          const y = startY + ((endY - startY) * step) / this.DRAG_STEPS;
          cy.get('body').trigger('mousemove', at(x, y));
        }
        cy.get('body').trigger('mousemove', at(endX, endY));
        cy.get('body').trigger('mouseup', at(endX, endY));
      });
    });

    // Wait for nestable to finish the drop before the caller reads positions again: during a drag it
    // holds a floating `.dd-dragel` clone and a `.dd-placeholder` gap, both removed on drag-stop.
    cy.get('#category-list').find('.dd-dragel, .dd-placeholder').should('not.exist');
    cy.wait(this.DROP_SETTLE_MS);
  };
}
