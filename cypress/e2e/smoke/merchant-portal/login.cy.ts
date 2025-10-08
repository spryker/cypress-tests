import { container } from '@utils';
import { DashboardPage, LoginPage } from '@pages/mp';
import { LoginStaticFixtures } from '@interfaces/smoke';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
(['b2c', 'b2b'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'login',
  { tags: ['@smoke', '@merchant-portal', 'marketplace-merchantportal-core', 'spryker-core'] },
  (): void => {
    const loginPage = container.get(LoginPage);
    const dashboardPage = container.get(DashboardPage);

    let staticFixtures: LoginStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    it('merchant user should login to merchant portal', (): void => {
      loginPage.visit();
      loginPage.login({
        username: staticFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      dashboardPage.assertPageLocation();
    });
  }
);
