import { container } from '@utils';
import { NavigationSmokeDynamicFixtures, NavigationSmokeStaticFixtures } from '@interfaces/backoffice';
import { IndexPage, NavigationMenuPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'navigation smoke',
  { tags: ['@backoffice', 'navigation', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const indexPage = container.get(IndexPage);
    const navigationMenuPage = container.get(NavigationMenuPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: NavigationSmokeStaticFixtures;
    let dynamicFixtures: NavigationSmokeDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      indexPage.visit();
    });

    it('should open every left navigation node without an error', (): void => {
      // Arrange
      navigationMenuPage.getMenuItemPaths().then((paths) => {
        expect(paths, 'navigable side-menu nodes').to.have.length.greaterThan(0);
        cy.log(`crawling ${paths.length} navigation nodes`);

        // Act
        paths.forEach((path) => {
          cy.visitBackoffice(path);

          // Assert
          // The user-navigation toggler only renders inside the full back-office chrome, so its
          // absence is how a node that errored or bounced to the login page shows up.
          navigationMenuPage.getUserNavigationToggler().should('exist');
          cy.url().should('not.include', staticFixtures.accessDeniedUrlPart);
        });
      });
    });

    it('should render an icon for every top level navigation node', (): void => {
      // Act
      navigationMenuPage.getTopLevelIcons().then(($icons) => {
        // Assert
        navigationMenuPage.getTopLevelMenuItems().should('have.length', $icons.length);
      });
    });
  }
);
