import { container } from '@utils';
import { AclNavigationAccessDynamicFixtures } from '@interfaces/backoffice';
import { AclNavigationAccessScenario } from '@scenarios/backoffice';

describe(
  'ACL navigation access',
  { tags: ['@backoffice', 'acl', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped due to repo not being suite', () => {});
      return;
    }

    const aclNavigationAccessScenario = container.get(AclNavigationAccessScenario);
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
  }
);
