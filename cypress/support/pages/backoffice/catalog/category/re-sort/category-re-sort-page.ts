import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { CategoryReSortRepository, SubCategoryPosition } from './category-re-sort-repository';

@injectable()
@autoWired
export class CategoryReSortPage extends BackofficePage {
  @inject(REPOSITORIES.CategoryReSortRepository) private repository: CategoryReSortRepository;

  private DRAG_STEPS = 12;

  visitReSortPage = (idCategoryNode: number): void => {
    cy.visitBackoffice(`/category-gui/re-sort?id-node=${idCategoryNode}`);
    this.repository.getCategoryList().should('be.visible');
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

  // Drag-reorder of the jQuery-nestable list (`.dd`). Nestable tracks the pointer while a
  // `.dd-handle` is held, so we replay pointerdown -> stepped pointermove -> pointerup and mirror
  // each to the mouse-event variants for handlers that only bind the mouse family. HONEST GUESS:
  // the drop lands the dragged item just past the target's centre; the exact move granularity and
  // overshoot nestable needs to commit a reorder is not documented and may need tuning.
  reorder = (from: SubCategoryPosition, to: SubCategoryPosition): void => {
    const fromSelector = `${this.repository.getSubCategorySelector(from)} > .dd-handle`;
    const toSelector = `${this.repository.getSubCategorySelector(to)} > .dd-handle`;

    cy.get(fromSelector).then(($from) => {
      cy.get(toSelector).then(($to) => {
        const source = $from[0];
        const fromRect = source.getBoundingClientRect();
        const toRect = $to[0].getBoundingClientRect();

        const startX = fromRect.left + fromRect.width / 2;
        const startY = fromRect.top + fromRect.height / 2;
        const endX = toRect.left + toRect.width / 2;
        const endY = toRect.top + toRect.height / 2;

        this.dispatchDrag(source, 'down', startX, startY);
        for (let step = 1; step <= this.DRAG_STEPS; step += 1) {
          const x = startX + ((endX - startX) * step) / this.DRAG_STEPS;
          const y = startY + ((endY - startY) * step) / this.DRAG_STEPS;
          this.dispatchDrag(document.body, 'move', x, y);
        }
        // Overshoot one row height past the target so nestable commits the item after it.
        this.dispatchDrag(document.body, 'move', endX, endY + toRect.height);
        this.dispatchDrag(document.body, 'up', endX, endY + toRect.height);
      });
    });
  };

  private dispatchDrag = (element: Element, phase: 'down' | 'move' | 'up', x: number, y: number): void => {
    const init: PointerEventInit & MouseEventInit = {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      button: 0,
      view: window,
    };
    const pointerType = phase === 'down' ? 'pointerdown' : phase === 'up' ? 'pointerup' : 'pointermove';
    const mouseType = phase === 'down' ? 'mousedown' : phase === 'up' ? 'mouseup' : 'mousemove';

    element.dispatchEvent(new PointerEvent(pointerType, { ...init, pointerId: 1 }));
    element.dispatchEvent(new MouseEvent(mouseType, init));
  };
}
