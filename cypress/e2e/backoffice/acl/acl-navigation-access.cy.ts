import { container } from '@utils';
import {
  AclNavigationAccessDynamicFixtures,
  AclNavigationAccessStaticFixtures,
  AclUserScenarioFixture,
} from '@interfaces/backoffice';
import { IndexPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'ACL navigation access',
  { tags: ['@backoffice', 'acl', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped due to repo not being suite', () => {});
      return;
    }

    const indexPage = container.get(IndexPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const ACCESS_DENIED_URL_PART = '/acl/index/denied';

    const scenarios: Array<{ title: string; userKey: keyof AclNavigationAccessDynamicFixtures }> = [
      { title: 'single-role user with product-management permissions', userKey: 'restrictedUser' },
      { title: 'multi-group user combining allow + deny rules across groups', userKey: 'combinedUser' },
    ];

    scenarios.forEach(({ title, userKey }) => {
      it(title, (): void => {
        const { staticFixtures, dynamicFixtures } = Cypress.env() as {
          staticFixtures: AclNavigationAccessStaticFixtures;
          dynamicFixtures: AclNavigationAccessDynamicFixtures;
        };
        const scenario: AclUserScenarioFixture = staticFixtures[userKey];

        userLoginScenario.execute({
          username: dynamicFixtures[userKey].username,
          password: scenario.password,
        });
        indexPage.visit();

        scenario.expectedMenuItems.forEach((label) => {
          cy.contains('[data-qa="menu-item-label"]', label).should('exist');
        });

        scenario.allowedPaths.forEach((path) => {
          cy.visitBackoffice(path);
          cy.url().should('include', path).and('not.include', ACCESS_DENIED_URL_PART);
        });

        scenario.deniedPaths.forEach((path) => {
          cy.visitBackoffice(path);
          cy.url().should('include', ACCESS_DENIED_URL_PART);
        });
      });
    });
  }
);
