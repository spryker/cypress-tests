import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { NavigationMenuRepository } from './navigation-menu-repository';

@injectable()
@autoWired
export class NavigationMenuPage extends BackofficePage {
  @inject(NavigationMenuRepository) private repository: NavigationMenuRepository;

  filterMenu = (searchTerm: string): void => {
    cy.get(this.repository.getFilterInputSelector()).clear();
    cy.get(this.repository.getFilterInputSelector()).type(searchTerm);
  };

  clearFilter = (): void => {
    cy.get(this.repository.getFilterInputSelector()).clear();
  };

  assertFilterInputVisible = (): void => {
    cy.get(this.repository.getFilterInputSelector()).should('be.visible');
    cy.get(this.repository.getFilterInputSelector()).should('have.attr', 'placeholder');
  };

  assertMenuItemsFiltered = (): void => {
    cy.get(this.repository.getHiddenMenuItemsSelector()).should('have.length.greaterThan', 0);
    cy.get(this.repository.getVisibleMenuItemsSelector()).should('have.length.greaterThan', 0);
  };

  assertAllMenuItemsVisible = (): void => {
    cy.get(this.repository.getNavigationMenuSelector())
      .find(`> ${this.repository.getMenuItemSelector()}, > ${this.repository.getMenuParentItemSelector()}`)
      .each(($item) => {
        cy.wrap($item).should('be.visible');
      });
  };

  assertParentItemExpanded = (parentLabel: string): void => {
    cy.get(this.repository.getNavigationMenuSelector()).then(($menu) => {
      const hasParent =
        $menu.find(`${this.repository.getMenuItemLabelSelector()}:contains("${parentLabel}")`).length > 0;

      if (hasParent) {
        cy.contains(this.repository.getMenuItemLabelSelector(), parentLabel)
          .parents(this.repository.getMenuParentItemSelector())
          .first()
          .should('have.class', 'active');
      }
    });
  };

  assertParentItemVisible = (parentLabel: string): void => {
    cy.get(this.repository.getNavigationMenuSelector()).then(($menu) => {
      const hasParent =
        $menu.find(`${this.repository.getMenuItemLabelSelector()}:contains("${parentLabel}")`).length > 0;

      if (hasParent) {
        cy.contains(this.repository.getMenuItemLabelSelector(), parentLabel)
          .parents(this.repository.getMenuParentItemSelector())
          .first()
          .should('be.visible');
      }
    });
  };

  assertOnlyMatchingChildrenVisible = (parentLabel: string, childLabel: string, searchTerm: string): void => {
    cy.get(this.repository.getNavigationMenuSelector()).then(($menu) => {
      const hasParent =
        $menu.find(`${this.repository.getMenuItemLabelSelector()}:contains("${parentLabel}")`).length > 0;
      const hasChild = $menu.find(`${this.repository.getMenuItemLabelSelector()}:contains("${childLabel}")`).length > 0;

      if (hasParent && hasChild) {
        cy.contains(this.repository.getMenuItemLabelSelector(), parentLabel)
          .parents(this.repository.getMenuParentItemSelector())
          .first()
          .find(`${this.repository.getMenuSubmenuSelector()} ${this.repository.getMenuItemSelector()}`)
          .then(($children) => {
            const visibleChildren = $children.filter(':visible');
            const hasMatchingChild = visibleChildren
              .toArray()
              .some((el) => Cypress.$(el).text().toLowerCase().includes(searchTerm.toLowerCase()));

            if (hasMatchingChild) {
              expect(visibleChildren.length).to.be.lessThan($children.length);
            }
          });
      }
    });
  };

  assertAllParentItemsClosed = (): void => {
    cy.get(`${this.repository.getActiveMenuItemSelector()} ${this.repository.getMenuSubmenuSelector()}.in`).should(
      'not.exist'
    );
  };

  assertMenuOrderUnchanged = (originalOrder: string[]): void => {
    cy.get(`${this.repository.getNavigationMenuSelector()} ${this.repository.getMenuItemLabelSelector()}`).then(
      ($labels) => {
        const currentOrder = $labels.map((i, el) => Cypress.$(el).text()).get();
        expect(currentOrder).to.deep.equal(originalOrder);
      }
    );
  };

  getMenuItemsOrder = (): Cypress.Chainable<string[]> => {
    return cy
      .get(`${this.repository.getNavigationMenuSelector()} ${this.repository.getMenuItemLabelSelector()}`)
      .then(($labels) => {
        return $labels.map((i, el) => Cypress.$(el).text()).get();
      });
  };

  assertFilterValueEmpty = (): void => {
    cy.get(this.repository.getFilterInputSelector()).should('have.value', '');
  };

  pressEnter = (): void => {
    cy.get(this.repository.getFilterInputSelector()).type('{enter}');
  };

  assertItemVisible = (itemLabel: string): void => {
    cy.contains(this.repository.getMenuItemLabelSelector(), itemLabel).should('be.visible');
  };

  hasMenuItem = (itemLabel: string): Cypress.Chainable<boolean> => {
    return cy.get(this.repository.getNavigationMenuSelector()).then(($menu) => {
      return $menu.find(`${this.repository.getMenuItemLabelSelector()}:contains("${itemLabel}")`).length > 0;
    });
  };

  assertAnyMenuItemVisible = (): void => {
    cy.get(`${this.repository.getMenuItemSelector()}, ${this.repository.getMenuParentItemSelector()}`).should(
      'be.visible'
    );
  };

  assertVisibleMenuItemsExist = (): void => {
    cy.get(this.repository.getVisibleMenuItemsSelector()).should('have.length.greaterThan', 0);
  };

  assertActiveParentItemExists = (): void => {
    cy.get(this.repository.getActiveMenuItemSelector()).should('exist');
  };
}
