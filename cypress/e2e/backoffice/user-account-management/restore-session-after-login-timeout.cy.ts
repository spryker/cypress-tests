import { container } from '@utils';
import { IndexPage, LoginPage } from '@pages/backoffice';
import {
  RestoreSessionAfterLoginTimeoutDynamicFixtures,
  RestoreSessionAfterLoginTimeoutStaticFixtures,
} from '@interfaces/backoffice';

describe(
  'restore session after login timeout',
  {
    tags: ['@backoffice', '@user-account-management', 'security-gui', 'spryker-core'],
  },
  (): void => {
    const loginPage = container.get(LoginPage);
    const indexPage = container.get(IndexPage);

    let dynamicFixtures: RestoreSessionAfterLoginTimeoutDynamicFixtures;
    let staticFixtures: RestoreSessionAfterLoginTimeoutStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    suiteIt('should redirect administrator to last-visited page after session timeout re-login', (): void => {
      loginPage.visit();
      loginPage.login({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      cy.visitBackoffice(staticFixtures.lastVisitedPageUrl);
      loginPage.clearSessionCookie();
      cy.reload();
      loginPage.login({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      cy.url({ timeout: 20000 }).should('include', staticFixtures.lastVisitedPageUrl);
    });

    suiteIt('should redirect administrator to home page when no last-visited page is recorded', (): void => {
      loginPage.visit();
      loginPage.login({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      indexPage.assertPageLocation();
    });

    function suiteIt(description: string, testFn: () => void): void {
      onlyForRepositoriesIt(['suite'], description, testFn);
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
