import { container } from '@utils';
import { NavigationMenuFilterStaticFixtures } from '@interfaces/backoffice';
import { IndexPage, NavigationMenuPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'navigation menu filter',
  { tags: ['@backoffice', 'navigation', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped due to repo not being suite', () => {});
      return;
    }
    const indexPage = container.get(IndexPage);
    const navigationMenuPage = container.get(NavigationMenuPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: NavigationMenuFilterStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      indexPage.visit();
    });

    it('should filter menu items correctly', (): void => {
      navigationMenuPage.getFilterInput().should('be.visible');
      navigationMenuPage.getFilterInput().should('have.attr', 'placeholder');

      navigationMenuPage.filterMenu(staticFixtures.searchTermShort);
      navigationMenuPage.getAnyMenuItems().should('be.visible');

      navigationMenuPage.filterMenu(staticFixtures.searchTermWithParentAndChild);
      navigationMenuPage.getHiddenMenuItems().should('have.length.greaterThan', 0);
      navigationMenuPage.getVisibleMenuItems().should('have.length.greaterThan', 0);

      navigationMenuPage.hasMenuItem(staticFixtures.searchTermValid).then((hasItem) => {
        if (hasItem) {
          navigationMenuPage.filterMenu(staticFixtures.searchTermValid.toLowerCase());
          navigationMenuPage.getItemByLabel(staticFixtures.searchTermValid).should('be.visible');
        }
      });

      navigationMenuPage.clearFilter();
      navigationMenuPage.getTopLevelMenuItems().each(($item) => {
        cy.wrap($item).should('be.visible');
      });
      navigationMenuPage.getOpenActiveSubmenus().should('not.exist');
    });

    it('should handle parent-child filtering logic', (): void => {
      navigationMenuPage.hasMenuItem('Marketplace').then((hasMarketplace) => {
        if (hasMarketplace) {
          navigationMenuPage.filterMenu('Offers');

          navigationMenuPage.getNavigationMenu().then(($menu) => {
            const hasParent =
              $menu.find(`${navigationMenuPage.getMenuItemLabelSelector()}:contains("Marketplace")`).length > 0;

            if (hasParent) {
              navigationMenuPage.getParentItemByLabel('Marketplace').should('be.visible');
            }
          });

          navigationMenuPage.getNavigationMenu().then(($menu) => {
            const hasParent =
              $menu.find(`${navigationMenuPage.getMenuItemLabelSelector()}:contains("Marketplace")`).length > 0;

            if (hasParent) {
              navigationMenuPage
                .getParentItemByLabel('Marketplace')
                .should('have.class', 'matched')
                .find(navigationMenuPage.getMenuSubmenuSelector())
                .should('be.visible');
            }
          });
        }
      });

      navigationMenuPage.filterMenu(staticFixtures.searchTermWithParentAndChild);
      navigationMenuPage.getNavigationMenu().then(($menu) => {
        const hasParent =
          $menu.find(
            `${navigationMenuPage.getMenuItemLabelSelector()}:contains("${staticFixtures.expectedParentLabel}")`
          ).length > 0;
        const hasChild =
          $menu.find(
            `${navigationMenuPage.getMenuItemLabelSelector()}:contains("${staticFixtures.expectedChildLabel}")`
          ).length > 0;

        if (hasParent && hasChild) {
          navigationMenuPage
            .getParentItemByLabel(staticFixtures.expectedParentLabel)
            .find(`${navigationMenuPage.getMenuSubmenuSelector()} ${navigationMenuPage.getMenuItemSelector()}`)
            .then(($children) => {
              const visibleChildren = $children.filter(':visible');
              const hasMatchingChild = visibleChildren
                .toArray()
                .some((el) =>
                  Cypress.$(el).text().toLowerCase().includes(staticFixtures.searchTermWithParentAndChild.toLowerCase())
                );

              if (hasMatchingChild) {
                expect(visibleChildren.length).to.be.lessThan($children.length);
              }
            });
        }
      });
    });

    it('should preserve menu order and support keyboard navigation', (): void => {
      navigationMenuPage.getMenuItemsOrder().then((originalOrder) => {
        navigationMenuPage.filterMenu(staticFixtures.searchTermValid);
        navigationMenuPage.clearFilter();

        navigationMenuPage.getMenuItemLabels().then(($labels) => {
          const currentOrder = $labels.map((i: number, el: HTMLElement) => Cypress.$(el).text()).get();
          expect(currentOrder).to.deep.equal(originalOrder);
        });
      });

      navigationMenuPage.filterMenu(staticFixtures.searchTermValid);
      navigationMenuPage.pressEnter();
      cy.url().should('match', /dashboard|\/$/i);

      indexPage.visit();
      navigationMenuPage.filterMenu(staticFixtures.searchTermValid);
      cy.reload();
      navigationMenuPage.getFilterInput().should('have.value', '');
    });
  }
);
