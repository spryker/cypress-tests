import { CompanyConnectedAppsPage, ConnectedAppsPage } from '@pages/yves';
import { ClientAuthorizationScenario, CustomerLoginScenario } from '@scenarios/yves';
import {
  blockAgenticCommerceClient,
  container,
  exchangeAuthorizationCode,
  isAgenticCommerceCutReached,
  readPrincipal,
  registerAgenticCommerceClient,
  setAgenticCommerceScopeCeiling,
} from '@utils';
import {
  AgenticCommerceClient,
  AgenticCommerceCompanyConsentsStaticFixtures,
  AgenticCommerceTokens,
} from '@interfaces/api';

describe(
  'company-admin-reviews-consents',
  { tags: ['@yves', '@api', '@agentic-commerce', '@agentic-commerce-cut-6a-2', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('6a-2')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 6a-2', () => {});
      return;
    }

    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const companyConnectedAppsPage = container.get(CompanyConnectedAppsPage);
    const connectedAppsPage = container.get(ConnectedAppsPage);

    let staticFixtures: AgenticCommerceCompanyConsentsStaticFixtures;
    let client: AgenticCommerceClient;
    let companyUserTokens: AgenticCommerceTokens;
    let otherCompanyUserTokens: AgenticCommerceTokens;
    let otherCompanyConsentUuid: string;

    const connectAs = (email: string, orderLimit?: string): Cypress.Chainable<AgenticCommerceTokens> => {
      cy.clearAllCookies();

      return clientAuthorizationScenario
        .execute({ client, email, password: staticFixtures.defaultPassword, orderLimit })
        .then(({ proofKey, response }) => exchangeAuthorizationCode(client, String(response.code), proofKey))
        .then((tokenResponse) => tokenResponse.body);
    };

    const loginAs = (email: string): void => {
      customerLoginScenario.execute({ email, password: staticFixtures.defaultPassword });
    };

    before((): void => {
      ({ staticFixtures } = Cypress.env());
      registerAgenticCommerceClient('CompanyAdminReviews', staticFixtures.redirectUri, staticFixtures.scope).then(
        (registeredClient) => {
          client = { ...registeredClient, scope: staticFixtures.scopeWithOrderPlacement };
          setAgenticCommerceScopeCeiling(client, staticFixtures.scopeWithOrderPlacement.split(' '));
        }
      );

      cy.then(() => {
        connectAs(staticFixtures.companyAdmin.email);
        connectAs(staticFixtures.companyUser.email, staticFixtures.consentLimit.amount).then((tokens) => {
          companyUserTokens = tokens;
        });
        connectAs(staticFixtures.otherCompanyUser.email).then((tokens) => {
          otherCompanyUserTokens = tokens;
        });

        connectedAppsPage.visit();
        connectedAppsPage.getConsentUuid(client.name).then((consentUuid) => {
          otherCompanyConsentUuid = String(consentUuid);
        });
      });
    });

    after((): void => {
      if (client) {
        blockAgenticCommerceClient(client);
      }
    });

    it('company admin should see the active consents of the company users and none of another company', (): void => {
      const { companyAdmin, companyUser, otherCompanyUser, scopeLabel, texts } = staticFixtures;

      loginAs(companyAdmin.email);
      companyConnectedAppsPage.visit();

      [companyAdmin, companyUser].forEach((user) => {
        companyConnectedAppsPage.getUserCell(client.name, user.email).should('contain', user.fullName);
        companyConnectedAppsPage.getEmailCell(client.name, user.email).should('contain', user.email);
        companyConnectedAppsPage.getAppCell(client.name, user.email).should('contain', client.name);
        companyConnectedAppsPage.getScopesCell(client.name, user.email).should('contain', scopeLabel);
        companyConnectedAppsPage.getLastUsedCell(client.name, user.email).should('contain', texts.neverUsed);
        companyConnectedAppsPage.getRevokeButton(client.name, user.email).should('contain', texts.revoke);
      });

      companyConnectedAppsPage
        .getOrderLimitCell(client.name, companyUser.email)
        .should('contain', staticFixtures.consentLimit.label);
      companyConnectedAppsPage
        .getOrderLimitCell(client.name, companyAdmin.email)
        .should('not.contain', staticFixtures.consentLimit.label);

      companyConnectedAppsPage.getList().should('not.contain', otherCompanyUser.email);
      companyConnectedAppsPage.getConsentRow(client.name, otherCompanyUser.email).should('not.exist');
    });

    it('company admin should see the connected apps entry in the company account navigation', (): void => {
      loginAs(staticFixtures.companyAdmin.email);
      cy.visit('/company/overview');

      companyConnectedAppsPage
        .getNavigationEntry()
        .should('contain', staticFixtures.texts.connectedApps)
        .and('have.attr', 'href')
        .and('include', '/company/connected-apps');
    });

    it('company admin should not be able to revoke the consent of a user of another company', (): void => {
      const { companyAdmin, texts } = staticFixtures;

      loginAs(companyAdmin.email);
      companyConnectedAppsPage.visit();
      companyConnectedAppsPage.revokeForeignConsent(client.name, companyAdmin.email, otherCompanyConsentUuid);

      companyConnectedAppsPage.getFlashMessage().should('contain', texts.notInCompany);
      cy.then(() => {
        readPrincipal(otherCompanyUserTokens.access_token).its('status').should('equal', 200);
      });
    });

    it('company admin should revoke the consent of a company user and the client should lose that access', (): void => {
      const { companyAdmin, companyUser, texts } = staticFixtures;

      loginAs(companyAdmin.email);
      companyConnectedAppsPage.visit();
      companyConnectedAppsPage.revoke(client.name, companyUser.email);

      companyConnectedAppsPage.getFlashMessage().should('contain', texts.revoked);
      companyConnectedAppsPage.getConsentRow(client.name, companyUser.email).should('not.exist');
      companyConnectedAppsPage.getConsentRow(client.name, companyAdmin.email).should('exist');
      cy.then(() => {
        readPrincipal(companyUserTokens.access_token).its('status').should('equal', 401);
      });
    });

    it('company user without the permission should get no connected apps page and no navigation entry', (): void => {
      loginAs(staticFixtures.userWithoutPermission.email);

      // Yves answers a denied page with a redirect to its 403 error page.
      cy.request({ url: '/DE/en/company/connected-apps', failOnStatusCode: false, followRedirect: false }).then(
        (response) => {
          expect(response.redirectedToUrl).to.match(/\/error-page\/403$/);
        }
      );

      cy.visit('/company/overview');
      cy.url().should('include', '/company/overview');
      companyConnectedAppsPage.getNavigationEntry().should('not.exist');
    });
  }
);
