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
    tags: ['@mp', '@user-account-management', 'marketplace-merchantportal-core', '@quarantine'],
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
      ignoreExpiredSessionParsingError();

      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      cy.clearCookie('last-visited-page');

      // The Merchant Portal is an Angular application: the page's table data is fetched by an XHR that
      // is dispatched only after the window load event `cy.visitMerchantPortal()` resolves on. Dropping
      // the session cookie before that request goes out makes it land unauthenticated, follow the 302 to
      // the login page and receive HTML where the application expects JSON. Waiting for the request
      // settles the page, so the simulated timeout below cannot race it.
      cy.intercept('GET', `**${staticFixtures.lastVisitedPageUrl}/table-data**`).as('lastVisitedPageData');
      cy.visitMerchantPortal(staticFixtures.lastVisitedPageUrl);
      cy.wait('@lastVisitedPageData');

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

    // A Merchant Portal request that is still issued while the session is being dropped follows the 302
    // to the login page and fails to parse its HTML as JSON. That is the exact situation this test
    // simulates, so the resulting application error must not fail it. Matching on the login URL keeps
    // every unrelated application error failing the test as before.
    function ignoreExpiredSessionParsingError(): void {
      cy.on('uncaught:exception', (error: Error): false | void => {
        if (String(error?.message).includes(loginPage.getPageUrl())) {
          return false;
        }
      });
    }

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
