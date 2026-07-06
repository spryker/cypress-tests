import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { NavigationTreeRepository } from './navigation-tree-repository';

@injectable()
@autoWired
export class NavigationTreePage extends BackofficePage {
  @inject(REPOSITORIES.NavigationTreeRepository) private repository: NavigationTreeRepository;

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
    this.getNodeFormBody().find(this.repository.getLocalizedCmsPageUrlSelector(0)).clear().type(cmsPageUrlEn);
    this.getNodeFormBody().find(this.repository.getLocalizedCmsPageUrlSelector(1)).clear().type(cmsPageUrlDe);
    this.checkNodeIsActive();
    this.submitNodeForm();
    this.assertNodeCreateSuccess();
  };

  assertNodeIsChildOf = (idParentNode: number, childTitle: string): void => {
    cy.get(this.repository.getNodeSelector(idParentNode)).should('contain', childTitle);
  };

  // Drag a node onto a target node. jstree is a pointer-driven widget; the tree
  // state is asserted afterwards (with retry) rather than waiting a fixed time.
  moveNode = (idNavigationNode: number, idTargetNavigationNode: number): void => {
    const source = this.repository.getNodeAnchorSelector(idNavigationNode);
    const target = this.repository.getNodeAnchorSelector(idTargetNavigationNode);

    cy.get(source).then(($source) => {
      const sourceRect = $source[0].getBoundingClientRect();

      cy.get(source).trigger('pointerdown', { which: 1, button: 0, force: true });
      cy.get(source).trigger('pointermove', {
        which: 1,
        clientX: sourceRect.x + 5,
        clientY: sourceRect.y + 5,
        force: true,
      });

      cy.get(target).then(($target) => {
        const targetRect = $target[0].getBoundingClientRect();

        cy.get(target).trigger('pointermove', {
          which: 1,
          clientX: targetRect.x + 5,
          clientY: targetRect.y + 5,
          force: true,
        });
        cy.get(target).trigger('pointerup', { which: 1, button: 0, force: true });
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

  // Same-origin backoffice iframe: read its body fresh on every access so a
  // form reload (submit redirect / add-child navigation) cannot detach the ref.
  private getNodeFormBody(): Cypress.Chainable<JQuery<HTMLElement>> {
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
