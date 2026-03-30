import { container } from '@utils';
import { DashboardPage, LoginPage } from '@pages/mp';
import {
  RestoreSessionAfterLoginTimeoutDynamicFixtures,
  RestoreSessionAfterLoginTimeoutStaticFixtures,
} from '@interfaces/mp';
import { MerchantUserLoginScenario } from '@scenarios/mp';

describe(
  'restore session after login timeout',
  {
    tags: ['@mp', '@user-account-management', 'marketplace-merchantportal-core'],
  },
  (): void => {
    const loginPage = container.get(LoginPage);
    const dashboardPage = container.get(DashboardPage);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    let dynamicFixtures: RestoreSessionAfterLoginTimeoutDynamicFixtures;
    let staticFixtures: RestoreSessionAfterLoginTimeoutStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    suiteIt('should redirect merchant user to last-visited page after session timeout re-login', (): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      cy.clearCookie('last-visited-page');
      cy.visitMerchantPortal(staticFixtures.lastVisitedPageUrl);
      cy.reload();

      loginPage.clearSessionCookie();

      cy.reload();
      loginPage.login({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      cy.url({ timeout: 20000 }).should('include', staticFixtures.lastVisitedPageUrl);
    });

    suiteIt('should redirect merchant user to dashboard page when no last-visited page is recorded', (): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      dashboardPage.assertPageLocation();
    });

    function suiteIt(description: string, testFn: () => void): void {
      onlyForRepositoriesIt(['suite', 'b2b-mp'], description, testFn);
    }

    function onlyForRepositoriesIt(repositoryIds: string[], description: string, testFn: () => void): void {
      if (!repositoryIds.includes(Cypress.env('repositoryId'))) {
        it.skip(description, testFn);

        return;
      }

      it(description, testFn);
    }
  }
);
