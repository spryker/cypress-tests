import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { NavigationTreeRepository } from './navigation-tree-repository';

@injectable()
@autoWired
export class NavigationTreePage extends BackofficePage {
  @inject(REPOSITORIES.NavigationTreeRepository) private repository: NavigationTreeRepository;

  // Time for the node-form iframe to finish its delayed second load before we read/type into it.
  private FORM_SETTLE_MS = 1000;

  // -------- Navigation element CRUD --------

  createNavigation = (data: NavigationFormData): Cypress.Chainable<number> => {
    cy.visitBackoffice(this.repository.getNavigationCreateUrl());
    this.repository.getNameInput().clear().type(data.name);
    this.repository.getKeyInput().clear().type(data.key);
    this.setIsActive(data.isActive);
    this.repository.getNavigationSaveButton().click();

    return this.grabIdFromSuccessMessage(this.repository.getCreateSuccessPattern());
  };

  assertOnListPage = (): void => {
    cy.url().should('include', this.repository.getNavigationListUrl());
  };

  assertListNotEmpty = (): void => {
    this.repository.getListTableRows().should('have.length.greaterThan', 0);
  };

  updateNavigation = (idNavigation: number, data: Partial<NavigationFormData>): void => {
    cy.visitBackoffice(this.repository.getNavigationUpdateUrl(idNavigation));

    if (data.name !== undefined) {
      this.repository.getNameInput().clear().type(data.name);
    }

    if (data.isActive !== undefined) {
      this.setIsActive(data.isActive);
    }

    this.repository.getNavigationSaveButton().click();
    this.assertSuccessMessage(this.repository.getUpdateSuccessPattern());
  };

  deleteNavigation = (idNavigation: number): void => {
    cy.visitBackoffice(this.repository.getNavigationDeleteUrl(idNavigation));
    this.repository.getDeleteSubmitButton().click();
    this.assertSuccessMessage(this.repository.getDeleteSuccessPattern());
  };

  assertSuccessMessage = (pattern: RegExp): void => {
    this.repository.getSuccessAlert().invoke('text').should('match', pattern);
  };

  // -------- Navigation tree (jstree) --------

  // Loading the tree of a specific navigation: filter the DataTable to that
  // navigation and select its row. The table auto-selects the (single) filtered
  // row on redraw, which fires the AJAX tree load into #navigation-tree.
  openNavigationTree = (navigationName: string): void => {
    cy.visitBackoffice(this.repository.getNavigationListUrl());
    this.repository.getTableSearchInput().clear().type(navigationName);
    this.repository.getTableRowByText(navigationName).click();
    cy.get(this.repository.getTreeSelector(), { timeout: 20000 }).should('exist');

    // The tree renders asynchronously (jstree AJAX) and the select→edit-form binding attaches only
    // after the Zed bundle parses. Wait for jstree to have painted at least the root node, then settle
    // so a following clickNode actually loads the edit form instead of leaving the default create form.
    cy.get(this.repository.getTreeNodeSelector(), { timeout: 20000 }).should('have.length.at.least', 1);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(this.FORM_SETTLE_MS);
  };

  assertNumberOfNodes = (count: number): void => {
    cy.get(this.repository.getTreeNodeSelector(), { timeout: 20000 }).should('have.length', count);
  };

  clickNode = (idNavigationNode: number): void => {
    cy.get(this.repository.getNodeAnchorSelector(idNavigationNode), { timeout: 20000 }).click();
  };

  assertNodeFormIsCreate = (): void => {
    this.getNodeFormBody().should('contain', this.repository.getCreateChildNodeHeading());
  };

  assertNodeFormIsEdit = (): void => {
    this.getNodeFormBody().should('contain', this.repository.getEditNodeHeading());
  };

  createChildNodeWithoutType = (title: string): void => {
    this.fillLocalizedTitles(title);
    this.checkNodeIsActive();
    this.submitNodeForm();
    this.assertNodeCreateSuccess();
  };

  createChildNodeWithExternalUrl = (title: string, externalUrl: string): void => {
    this.selectNodeType('external_url');
    this.fillLocalizedTitles(title);
    this.fillLocalizedField(this.repository.getLocalizedExternalUrlSelector.bind(this.repository), externalUrl);
    this.checkNodeIsActive();
    this.submitNodeForm();
    this.assertNodeCreateSuccess();
  };

  updateNodeToCategoryType = (categoryUrlEn: string, categoryUrlDe: string): void => {
    this.selectNodeType('category');
    // The category-node form requires a title per locale. The seeded node only carries an en_US title
    // (the fixture helper is single-locale), so set both here to avoid a "should not be blank" reject.
    this.fillLocalizedTitles('foo');
    this.getNodeFormBody().find(this.repository.getLocalizedCategoryUrlSelector(0)).clear().type(categoryUrlEn);
    this.getNodeFormBody().find(this.repository.getLocalizedCategoryUrlSelector(1)).clear().type(categoryUrlDe);
    this.submitNodeForm();
    this.getNodeFormBody().should('contain.text', 'was updated successfully.');
  };

  clickAddChildNode = (): void => {
    this.getNodeFormBody().find(this.repository.getAddChildNodeButtonSelector()).click();
    this.assertNodeFormIsCreate();
  };

  createChildNodeWithCmsPageType = (title: string, cmsPageUrlEn: string, cmsPageUrlDe: string): void => {
    this.selectNodeType('cms_page');
    this.fillLocalizedTitles(title);
    // In the create-child form the locale sections render de_DE first (index 0) then en_US (index 1) —
    // the reverse of the edit form. cms_page_url is validated against the locale, so the URLs must be
    // placed by locale, not by a fixed en/de index order, or the server rejects them as "not valid
    // for the given locale". (category_url isn't locale-checked, which is why the edit test tolerated it.)
    this.getNodeFormBody().find(this.repository.getLocalizedCmsPageUrlSelector(0)).clear().type(cmsPageUrlDe);
    this.getNodeFormBody().find(this.repository.getLocalizedCmsPageUrlSelector(1)).clear().type(cmsPageUrlEn);
    this.checkNodeIsActive();
    this.submitNodeForm();
    this.assertNodeCreateSuccess();
  };

  assertNodeIsChildOf = (idParentNode: number, childTitle: string): void => {
    cy.get(this.repository.getNodeSelector(idParentNode)).should('contain', childTitle);
  };

  // Drag a node onto the middle of a target node so jstree re-parents it as a child. jstree's dnd
  // plugin binds mousedown on the anchor and mousemove/mouseup on the document, positioning by
  // pageX/pageY — a constructed event can't set those, so drive it with Cypress `.trigger`. Arm the
  // drag with a small initial move past jstree's threshold, step to the target's vertical centre
  // (the "make child" zone), then release. The tree state is asserted afterwards (with retry).
  moveNode = (idNavigationNode: number, idTargetNavigationNode: number): void => {
    const source = this.repository.getNodeAnchorSelector(idNavigationNode);
    const target = this.repository.getNodeAnchorSelector(idTargetNavigationNode);

    cy.get(source).then(($source) => {
      cy.get(target).then(($target) => {
        const from = $source[0].getBoundingClientRect();
        const to = $target[0].getBoundingClientRect();
        const win = $source[0].ownerDocument.defaultView;
        const scrollX = win?.scrollX ?? 0;
        const scrollY = win?.scrollY ?? 0;

        const startX = from.left + from.width / 2;
        const startY = from.top + from.height / 2;
        const endX = to.left + to.width / 2;
        const endY = to.top + to.height / 2;

        const at = (clientX: number, clientY: number): Record<string, number | boolean> => ({
          which: 1,
          button: 0,
          clientX,
          clientY,
          pageX: clientX + scrollX,
          pageY: clientY + scrollY,
          force: true,
        });

        // jstree's dnd resolves the drop node from the event target (not geometry, as nestable does),
        // so the moves that matter must be dispatched ON the target anchor — a move on <body> leaves
        // e.target as <body> and jstree never sees the node. Arm the drag with a move off the source,
        // then hover the target twice (once to register, once to settle the "inside" drop marker).
        cy.get(source).trigger('mousedown', at(startX, startY));
        cy.get('body').trigger('mousemove', at(startX + 10, startY + 10));
        cy.get(target).trigger('mousemove', at(endX, endY));
        cy.get(target).trigger('mousemove', at(endX, endY));
        cy.get(target).trigger('mouseup', at(endX, endY));
      });
    });
  };

  saveTreeOrder = (): void => {
    this.repository.getTreeSaveButton().click();
    cy.get(this.repository.getSweetAlertContainer(), { timeout: 20000 }).should('be.visible');
    cy.get(this.repository.getSweetAlertContainer()).should('contain', this.repository.getTreeUpdateSuccessMessage());
    cy.get(this.repository.getSweetAlertConfirm()).click();
  };

  // -------- internal helpers --------

  private setIsActive(isActive: boolean): void {
    if (isActive) {
      this.repository.getIsActiveCheckbox().check({ force: true });
    } else {
      this.repository.getIsActiveCheckbox().uncheck({ force: true });
    }
  }

  private grabIdFromSuccessMessage(pattern: RegExp): Cypress.Chainable<number> {
    return this.repository
      .getSuccessAlert()
      .invoke('text')
      .then((text: string) => {
        expect(text).to.match(pattern);
        const match = text.match(/(\d+)/);

        return Number(match ? match[1] : NaN);
      });
  }

  // Same-origin backoffice iframe. The form issues a delayed second load after the tree selects a
  // node (Zed re-renders it once the node-type widgets init), which detaches elements mid-chain.
  // Settle first, then read the body fresh on every access so each interaction targets the final DOM.
  private getNodeFormBody(): Cypress.Chainable<JQuery<HTMLElement>> {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(this.FORM_SETTLE_MS);

    return cy
      .get(this.repository.getNodeFormIframeSelector(), { timeout: 20000 })
      .its('0.contentDocument.body', { timeout: 20000 })
      .should('not.be.empty')
      .then((body) => cy.wrap(body as HTMLElement)) as unknown as Cypress.Chainable<JQuery<HTMLElement>>;
  }

  private selectNodeType(nodeType: string): void {
    this.getNodeFormBody().find(this.repository.getNodeTypeSelectSelector()).select(nodeType, { force: true });
  }

  private fillLocalizedTitles(title: string): void {
    this.getNodeFormBody().find(this.repository.getLocalizedTitleSelector(0)).clear({ force: true }).type(title);
    this.getNodeFormBody().find(this.repository.getLocalizedTitleSelector(1)).clear({ force: true }).type(title);
  }

  private fillLocalizedField(selectorFor: (index: number) => string, value: string): void {
    this.getNodeFormBody().find(selectorFor(0)).clear({ force: true }).type(value);
    this.getNodeFormBody().find(selectorFor(1)).clear({ force: true }).type(value);
  }

  private checkNodeIsActive(): void {
    this.getNodeFormBody().find(this.repository.getNodeIsActiveSelector()).check({ force: true });
  }

  private submitNodeForm(): void {
    this.getNodeFormBody().find(this.repository.getNodeFormSubmitSelector()).click();
  }

  private assertNodeCreateSuccess(): void {
    this.getNodeFormBody().should('contain.text', 'was created successfully.');
  }
}

interface NavigationFormData {
  name: string;
  key: string;
  isActive: boolean;
}
