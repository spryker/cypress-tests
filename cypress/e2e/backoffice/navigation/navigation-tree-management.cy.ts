import { container } from '@utils';
import {
  NavigationTreeManagementDynamicFixtures,
  NavigationTreeManagementStaticFixtures,
} from '@interfaces/backoffice';
import { NavigationTreePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

// Seeding is now unblocked (haveNavigation/haveLocalizedNavigationNode registered in the
// TestifyBackendApi DynamicFixture suite), but the tree UI needs interactive verification:
// the DataTables search selector (`#navigation-table_filter input[type="search"]`) is wrong,
// the jstree drag-reorder needs mouse* events, and the fixed navigation keys must be made
// run-unique to survive the fresh-browser rerun. Un-skip once those are sorted in a local session.
describe.skip(
  'navigation tree management',
  { tags: ['@backoffice', 'navigation', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const navigationTreePage = container.get(NavigationTreePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: NavigationTreeManagementStaticFixtures;
    let dynamicFixtures: NavigationTreeManagementDynamicFixtures;

    // Navigation element name/key are made run-unique so repeated CI runs never
    // collide on the create validation. The Codeception original relied on a
    // Propel teardown to purge fixed names; Cypress has no DB access here.
    const uid = Math.random().toString(36).substring(2, 8);

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
    it('should create, read, update and delete a navigation element', (): void => {
      const name = `Acceptance navigation ${uid}`;

      navigationTreePage
        .createNavigation({ name, key: `acc-navigation-${uid}`, isActive: true })
        .then((idNavigation) => {
          // read: navigation list is shown and not empty
          navigationTreePage.assertOnListPage();
          navigationTreePage.assertListNotEmpty();

          // update
          navigationTreePage.updateNavigation(idNavigation, { name: `${name} - edited`, isActive: false });

          // delete
          navigationTreePage.deleteNavigation(idNavigation);
        });
    });

    // Ported from NavigationTreeCest::testSeeEmptyNavigationTree
    it('should display an empty navigation tree with a single root node', (): void => {
      navigationTreePage.openNavigationTree(dynamicFixtures.navigationEmpty.name);
      navigationTreePage.assertNumberOfNodes(1);
    });

    // Ported from NavigationTreeCest::testCreateChildNodeWithoutType
    it('should create a child node without a type', (): void => {
      navigationTreePage.openNavigationTree(dynamicFixtures.navigationWithoutType.name);
      navigationTreePage.assertNodeFormIsCreate();
      navigationTreePage.createChildNodeWithoutType('Child 1');
      navigationTreePage.assertNumberOfNodes(2);
    });

    // Ported from NavigationTreeCest::testCreateChildNodeWithExternalUrlType
    it('should create a child node with an external URL type', (): void => {
      navigationTreePage.openNavigationTree(dynamicFixtures.navigationExternalUrl.name);
      navigationTreePage.assertNodeFormIsCreate();
      navigationTreePage.createChildNodeWithExternalUrl('Child 2', 'http://google.com');
      navigationTreePage.assertNumberOfNodes(3);
    });

    // Ported from NavigationTreeCest::testUpdateNodeToCategoryType
    it('should update a node to a category type', (): void => {
      navigationTreePage.openNavigationTree(dynamicFixtures.navigationCategory.name);
      navigationTreePage.clickNode(dynamicFixtures.categoryNode.id_navigation_node);
      navigationTreePage.assertNodeFormIsEdit();
      navigationTreePage.updateNodeToCategoryType(staticFixtures.categoryUrlEn, staticFixtures.categoryUrlDe);
      navigationTreePage.assertNumberOfNodes(2);
    });

    // Ported from NavigationTreeCest::testCreateChildNodeWithCmsPageType
    it('should create a child node with a CMS page type', (): void => {
      navigationTreePage.openNavigationTree(dynamicFixtures.navigationCmsPage.name);
      navigationTreePage.clickNode(dynamicFixtures.cmsPageNode.id_navigation_node);
      navigationTreePage.assertNodeFormIsEdit();
      navigationTreePage.clickAddChildNode();
      navigationTreePage.createChildNodeWithCmsPageType(
        'Child 1.1',
        staticFixtures.cmsPageUrlEn,
        staticFixtures.cmsPageUrlDe
      );
      navigationTreePage.assertNumberOfNodes(3);
      navigationTreePage.assertNodeIsChildOf(dynamicFixtures.cmsPageNode.id_navigation_node, 'Child 1.1');
    });

    // Ported from NavigationTreeCest::testChangeNavigationTreeStructure
    it('should change the navigation tree structure and persist it', (): void => {
      navigationTreePage.openNavigationTree(dynamicFixtures.navigationStructure.name);
      navigationTreePage.moveNode(
        dynamicFixtures.structureNode11.id_navigation_node,
        dynamicFixtures.structureNode2.id_navigation_node
      );
      navigationTreePage.assertNodeIsChildOf(dynamicFixtures.structureNode2.id_navigation_node, 'node_1_1');
      navigationTreePage.saveTreeOrder();
    });
  }
);
