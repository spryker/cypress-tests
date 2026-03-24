import { container } from '@utils';
import { LoginPage } from '@pages/yves';
import {
  RestoreSessionAfterLoginTimeoutDynamicFixtures,
  RestoreSessionAfterLoginTimeoutStaticFixtures,
} from '@interfaces/yves';

describe(
  'restore session after login timeout',
  {
    tags: ['@yves', '@customer-account-management', 'customer-account-management'],
  },
  (): void => {
    const loginPage = container.get(LoginPage);

    let dynamicFixtures: RestoreSessionAfterLoginTimeoutDynamicFixtures;
    let staticFixtures: RestoreSessionAfterLoginTimeoutStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    suiteIt('should redirect customer to last-visited page after session timeout re-login', (): void => {
      loginPage.visit();
      loginPage.login({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      loginPage.clearLastVisitedPageCookie();
      cy.visit(staticFixtures.lastVisitedPageUrl);
      loginPage.clearSessionCookie();
      loginPage.visit();
      loginPage.login({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      cy.url({ timeout: 20000 }).should('include', staticFixtures.lastVisitedPageUrl);
    });

    suiteIt('should redirect customer to overview page when no last-visited page is recorded', (): void => {
      loginPage.visit();
      loginPage.login({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      cy.url({ timeout: 20000 }).should('include', staticFixtures.customerOverviewUrl);
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
