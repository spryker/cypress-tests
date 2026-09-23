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

  pressEnter = (): void => {
    cy.get(this.repository.getFilterInputSelector()).type('{enter}');
  };

  getFilterInput = (): Cypress.Chainable => cy.get(this.repository.getFilterInputSelector());

  getNavigationMenu = (): Cypress.Chainable => cy.get(this.repository.getNavigationMenuSelector());

  getHiddenMenuItems = (): Cypress.Chainable => cy.get(this.repository.getHiddenMenuItemsSelector());

  getVisibleMenuItems = (): Cypress.Chainable => cy.get(this.repository.getVisibleMenuItemsSelector());

  getAnyMenuItems = (): Cypress.Chainable =>
    cy.get(`${this.repository.getMenuItemSelector()}, ${this.repository.getMenuParentItemSelector()}`);

  getTopLevelMenuItems = (): Cypress.Chainable =>
    cy
      .get(this.repository.getNavigationMenuSelector())
      .find(`> ${this.repository.getMenuItemSelector()}, > ${this.repository.getMenuParentItemSelector()}`);

  getOpenActiveSubmenus = (): Cypress.Chainable =>
    cy.get(`${this.repository.getActiveMenuItemSelector()} ${this.repository.getMenuSubmenuSelector()}.in`);

  getMenuItemLabels = (): Cypress.Chainable =>
    cy.get(`${this.repository.getNavigationMenuSelector()} ${this.repository.getMenuItemLabelSelector()}`);

  getItemByLabel = (label: string): Cypress.Chainable => cy.contains(this.repository.getMenuItemLabelSelector(), label);

  getParentItemByLabel = (label: string): Cypress.Chainable =>
    cy
      .contains(this.repository.getMenuItemLabelSelector(), label)
      .parents(this.repository.getMenuParentItemSelector())
      .first();

  getMenuItemLabelSelector = (): string => this.repository.getMenuItemLabelSelector();

  getMenuSubmenuSelector = (): string => this.repository.getMenuSubmenuSelector();

  getMenuItemSelector = (): string => this.repository.getMenuItemSelector();

  getMenuItemsOrder = (): Cypress.Chainable<string[]> => {
    return this.getMenuItemLabels().then(($labels) => {
      return $labels.map((i: number, el: HTMLElement) => Cypress.$(el).text()).get();
    });
  };

  hasMenuItem = (itemLabel: string): Cypress.Chainable<boolean> => {
    return cy.get(this.repository.getNavigationMenuSelector()).then(($menu) => {
      return $menu.find(`${this.repository.getMenuItemLabelSelector()}:contains("${itemLabel}")`).length > 0;
    });
  };
}
