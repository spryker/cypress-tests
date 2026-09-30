import { container } from '@utils';
import {
  NavigationTreeManagementDynamicFixtures,
  NavigationTreeManagementStaticFixtures,
} from '@interfaces/backoffice';
import { NavigationTreePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'navigation tree management',
  { tags: ['@backoffice', 'navigation', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const navigationTreePage = container.get(NavigationTreePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: NavigationTreeManagementStaticFixtures;
    let dynamicFixtures: NavigationTreeManagementDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    // Ported from NavigationCRUDCest::testICanCreateReadUpdateAndDeleteNavigation
    // Ported from NavigationTreeCest::testSeeEmptyNavigationTree
    // Ported from NavigationTreeCest::testCreateChildNodeWithoutType
    // Ported from NavigationTreeCest::testCreateChildNodeWithExternalUrlType
    // Ported from NavigationTreeCest::testUpdateNodeToCategoryType
    // Ported from NavigationTreeCest::testCreateChildNodeWithCmsPageType
    // Ported from NavigationTreeCest::testChangeNavigationTreeStructure
    it('should change the navigation tree structure and persist it', (): void => {
      navigationTreePage.openNavigationTree(dynamicFixtures.navigationStructure.name);
      navigationTreePage.moveNode(
        dynamicFixtures.structureNode11.id_navigation_node,
        dynamicFixtures.structureNode2.id_navigation_node
      );
      navigationTreePage.getNode(dynamicFixtures.structureNode2.id_navigation_node).should('contain', 'node_1_1');
      navigationTreePage.saveTreeOrder();
    });
  }
);
