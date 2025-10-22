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
      navigationMenuPage.assertFilterInputVisible();

      navigationMenuPage.filterMenu(staticFixtures.searchTermShort);
      navigationMenuPage.assertAnyMenuItemVisible();

      navigationMenuPage.filterMenu(staticFixtures.searchTermWithParentAndChild);
      navigationMenuPage.assertMenuItemsFiltered();

      navigationMenuPage.hasMenuItem(staticFixtures.searchTermValid).then((hasItem) => {
        if (hasItem) {
          navigationMenuPage.filterMenu(staticFixtures.searchTermValid.toLowerCase());
          navigationMenuPage.assertItemVisible(staticFixtures.searchTermValid);
        }
      });

      navigationMenuPage.clearFilter();
      navigationMenuPage.assertAllMenuItemsVisible();
      navigationMenuPage.assertAllParentItemsClosed();
    });

    it('should handle parent-child filtering logic', (): void => {
      navigationMenuPage.hasMenuItem('Marketplace').then((hasMarketplace) => {
        if (hasMarketplace) {
          navigationMenuPage.filterMenu('Offers');
          navigationMenuPage.assertParentItemVisible('Marketplace');
          navigationMenuPage.assertParentItemExpanded('Marketplace');
        }
      });

      navigationMenuPage.filterMenu(staticFixtures.searchTermWithParentAndChild);
      navigationMenuPage.assertOnlyMatchingChildrenVisible(
        staticFixtures.expectedParentLabel,
        staticFixtures.expectedChildLabel,
        staticFixtures.searchTermWithParentAndChild
      );
    });

    it('should preserve menu order and support keyboard navigation', (): void => {
      navigationMenuPage.getMenuItemsOrder().then((originalOrder) => {
        navigationMenuPage.filterMenu(staticFixtures.searchTermValid);
        navigationMenuPage.clearFilter();
        navigationMenuPage.assertMenuOrderUnchanged(originalOrder);
      });

      navigationMenuPage.filterMenu(staticFixtures.searchTermValid);
      navigationMenuPage.pressEnter();
      cy.url().should('match', /dashboard|\/$/i);

      indexPage.visit();
      navigationMenuPage.filterMenu(staticFixtures.searchTermValid);
      cy.reload();
      navigationMenuPage.assertFilterValueEmpty();
    });
  }
);
