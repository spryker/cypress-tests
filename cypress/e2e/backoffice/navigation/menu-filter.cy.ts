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

    it('should display filter input above the menu', (): void => {
      navigationMenuPage.assertFilterInputVisible();
    });

    it('should not filter when less than 3 characters are entered', (): void => {
      navigationMenuPage.filterMenu(staticFixtures.searchTermShort);
      navigationMenuPage.assertAnyMenuItemVisible();
    });

    it('should show parent sections for matching child items', (): void => {
      navigationMenuPage.hasMenuItem('Marketplace').then((hasMarketplace) => {
        if (hasMarketplace) {
          navigationMenuPage.filterMenu('Offers');
          navigationMenuPage.assertParentItemVisible('Marketplace');
          navigationMenuPage.assertParentItemExpanded('Marketplace');
        }
      });
    });

    it('should show only matching children when parent and children match', (): void => {
      navigationMenuPage.filterMenu(staticFixtures.searchTermWithParentAndChild);
      navigationMenuPage.assertOnlyMatchingChildrenVisible(
        staticFixtures.expectedParentLabel,
        staticFixtures.expectedChildLabel,
        staticFixtures.searchTermWithParentAndChild
      );
    });

    it('should reset filter and close parent sections when input is cleared', (): void => {
      navigationMenuPage.filterMenu(staticFixtures.searchTermWithParentAndChild);
      navigationMenuPage.assertMenuItemsFiltered();
      navigationMenuPage.assertActiveParentItemExists();

      navigationMenuPage.clearFilter();
      navigationMenuPage.assertAllMenuItemsVisible();
      navigationMenuPage.assertAllParentItemsClosed();
    });

    it('should not change the order of menu items', (): void => {
      navigationMenuPage.getMenuItemsOrder().then((originalOrder) => {
        navigationMenuPage.filterMenu(staticFixtures.searchTermValid);
        navigationMenuPage.clearFilter();
        navigationMenuPage.assertMenuOrderUnchanged(originalOrder);
      });
    });

    it('should not persist filter value after page reload', (): void => {
      navigationMenuPage.filterMenu(staticFixtures.searchTermValid);
      cy.reload();
      navigationMenuPage.assertFilterValueEmpty();
    });

    it('should open first matched item when Enter is pressed', (): void => {
      navigationMenuPage.filterMenu(staticFixtures.searchTermValid);
      navigationMenuPage.pressEnter();

      cy.url().should('match', /dashboard|\/$/i);
    });

    it('should match items case-insensitively', (): void => {
      navigationMenuPage.hasMenuItem(staticFixtures.searchTermValid).then((hasItem) => {
        if (hasItem) {
          navigationMenuPage.filterMenu(staticFixtures.searchTermValid.toLowerCase());
          navigationMenuPage.assertItemVisible(staticFixtures.searchTermValid);

          navigationMenuPage.filterMenu(staticFixtures.searchTermValid.toUpperCase());
          navigationMenuPage.assertItemVisible(staticFixtures.searchTermValid);
        }
      });
    });
  }
);
