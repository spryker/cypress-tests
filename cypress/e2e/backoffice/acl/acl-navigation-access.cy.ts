import { container } from '@utils';
import { AclNavigationAccessDynamicFixtures } from '@interfaces/backoffice';
import { AclDeniedPage, LoginPage } from '@pages/backoffice';
import { AclNavigationAccessScenario, UserLoginScenario } from '@scenarios/backoffice';

describe(
  'ACL navigation access',
  { tags: ['@backoffice', 'acl', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped due to repo not being suite', () => {});
      return;
    }

    const aclNavigationAccessScenario = container.get(AclNavigationAccessScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const aclDeniedPage = container.get(AclDeniedPage);
    const loginPage = container.get(LoginPage);
    const password = 'Change123@_!';

    it('single-role user with product-management permissions', (): void => {
      const { dynamicFixtures } = Cypress.env() as { dynamicFixtures: AclNavigationAccessDynamicFixtures };

      aclNavigationAccessScenario.execute({
        username: dynamicFixtures.restrictedUser.username,
        password: password,
        expectedMenuItems: ['Dashboard', 'Catalog', 'Products'],
        allowedPaths: ['/dashboard', '/product-management'],
        deniedPaths: ['/sales', '/customer', '/cms-gui/list-page/index', '/user'],
      });
    });

    it('multi-group user combining allow + deny rules across groups', (): void => {
      const { dynamicFixtures } = Cypress.env() as { dynamicFixtures: AclNavigationAccessDynamicFixtures };

      aclNavigationAccessScenario.execute({
        username: dynamicFixtures.combinedUser.username,
        password: password,
        expectedMenuItems: ['Dashboard', 'Sales', 'Customers'],
        allowedPaths: ['/dashboard', '/sales', '/customer'],
        deniedPaths: ['/sales/detail', '/cms-gui/list-page/index', '/user', '/product-management'],
      });
    });

    it('should deny an action for a role with an explicit deny rule', (): void => {
      // Arrange
      const { dynamicFixtures } = Cypress.env() as { dynamicFixtures: AclNavigationAccessDynamicFixtures };

      // The user's other role allows every bundle, so only the deny rule can stop this request —
      // which is what makes it a test of deny precedence rather than of a missing allow.
      userLoginScenario.execute({ username: dynamicFixtures.deniedActionUser.username, password: password });

      // Act
      cy.visitBackoffice('/product-attribute-gui/attribute/create');

      // Assert
      aclDeniedPage.getAccessDeniedTitle().should('have.text', 'Access denied');
    });

    it('should refuse login for a deactivated user', (): void => {
      // Arrange
      const { dynamicFixtures } = Cypress.env() as { dynamicFixtures: AclNavigationAccessDynamicFixtures };
      loginPage.visit();

      // Act
      loginPage.login({ username: dynamicFixtures.blockedUser.username, password: password });

      // Assert
      loginPage.getErrorMessage().should('contain.text', 'Authentication failed!');
    });
  }
);
