// Drag-reorder for the jQuery-nestable lists Zed renders as `<div class="dd"><ol class="dd-list">`
// (category re-sort, product-search filter reorder). Nestable binds `mousedown` on the list and
// `mousemove`/`mouseup` on the window, positioning by `e.pageX/e.pageY`. A constructed MouseEvent
// can't set pageX/pageY (they're read-only), so we drive it with Cypress `.trigger`, which does.
// The sequence: grab the handle (mousedown), a tiny initial move to arm the drag, stepped moves to
// the target with a one-row overshoot so nestable commits the item past the target, then mouseup.

const DRAG_STEPS = 12;

// Time for the Zed JS bundle to attach the nestable drag handlers after the page loads.
const WIDGET_INIT_MS = 2500;

// Nestable commits the drop and reflows the list a tick after mouseup; a back-to-back second
// reorder that reads element positions before that reflow lands on stale coordinates and misses.
const DROP_SETTLE_MS = 500;

// The list markup renders server-side, but the jQuery-nestable widget that makes it draggable is
// wired only after the large Zed JS bundle finishes parsing. Dragging before that binds is a silent
// no-op. Nestable exposes no Cypress-readable ready signal (its instance lives in the app jQuery's
// private data cache), so settle briefly to let the bundle attach the handlers. Call this after
// navigating to any page whose list is driven by nestable.
export function waitForNestableInit(): void {
  // eslint-disable-next-line cypress/no-unnecessary-waiting -- No observable ready signal on the nestable widget; see above.
  cy.wait(WIDGET_INIT_MS);
}

export interface NestableDragParams {
  // Selector of the list container carrying the `dd` class, e.g. `#category-list`.
  listSelector: string;
  // Selector of the `li.dd-item` being dragged.
  fromItemSelector: string;
  // Selector of the `li.dd-item` whose slot the item should land in.
  toItemSelector: string;
}

export function dragNestableItem(params: NestableDragParams): void {
  const handleSelector = `${params.fromItemSelector} > .dd-handle`;

  cy.get(handleSelector).then(($from) => {
    cy.get(params.toItemSelector).then(($to) => {
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
      // quarter to cross its midpoint and land the item in the target's slot.
      const draggingUp = toRect.top < fromRect.top;
      const endY = draggingUp ? toRect.top + toRect.height * 0.25 : toRect.top + toRect.height / 2;

      const at = (clientX: number, clientY: number): Record<string, number | boolean> => ({
        which: 1,
        button: 0,
        clientX,
        clientY,
        pageX: clientX + scrollX,
        pageY: clientY + scrollY,
        force: true,
      });

      cy.get(handleSelector).trigger('mousedown', at(startX, startY));
      cy.get('body').trigger('mousemove', at(startX, startY + 2));
      for (let step = 1; step <= DRAG_STEPS; step += 1) {
        const x = startX + ((endX - startX) * step) / DRAG_STEPS;
        const y = startY + ((endY - startY) * step) / DRAG_STEPS;
        cy.get('body').trigger('mousemove', at(x, y));
      }
      cy.get('body').trigger('mousemove', at(endX, endY));
      cy.get('body').trigger('mouseup', at(endX, endY));
    });
  });

  // Wait for nestable to finish the drop before the caller reads positions again: during a drag it
  // holds a floating `.dd-dragel` clone and a `.dd-placeholder` gap, both removed on drag-stop.
  cy.get(params.listSelector).find('.dd-dragel, .dd-placeholder').should('not.exist');
  // eslint-disable-next-line cypress/no-unnecessary-waiting -- Nestable exposes no post-drop signal; the reflow that follows drag-stop has no observable DOM marker to retry against.
  cy.wait(DROP_SETTLE_MS);
}
