import {
  blockAgenticCommerceClient,
  container,
  exchangeAuthorizationCode,
  isAgenticCommerceCutReached,
  readPrincipal,
  registerAgenticCommerceClient,
  setAgenticCommerceScopeCeiling,
} from '@utils';
import { ConsentListPage } from '@pages/backoffice';
import { ConnectedAppsPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ClientAuthorizationScenario } from '@scenarios/yves';
import {
  AgenticCommerceClient,
  AgenticCommerceConsentConstraintsStaticFixtures,
  AgenticCommerceTokens,
} from '@interfaces/api';

describe(
  'admin-revokes-consent',
  { tags: ['@backoffice', '@yves', '@api', '@agentic-commerce', '@agentic-commerce-cut-6a-1', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('6a-1')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 6a-1', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);
    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);
    const consentListPage = container.get(ConsentListPage);
    const connectedAppsPage = container.get(ConnectedAppsPage);

    let staticFixtures: AgenticCommerceConsentConstraintsStaticFixtures;
    let client: AgenticCommerceClient;

    before((): void => {
      ({ staticFixtures } = Cypress.env());
      registerAgenticCommerceClient('AdminRevokes', staticFixtures.redirectUri, staticFixtures.scope).then(
        (registeredClient) => {
          client = registeredClient;
        }
      );
    });

    after((): void => {
      if (client) {
        blockAgenticCommerceClient(client);
      }
    });

    // The constraints column arrives with cut 6b.
    if (isAgenticCommerceCutReached('6b')) {
      it('back office user should see the limits of a consent in the constraints column', (): void => {
        setAgenticCommerceScopeCeiling(client, staticFixtures.scopeWithOrderPlacement.split(' '));

        cy.then(() => {
          clientAuthorizationScenario.execute({
            client: { ...client, scope: staticFixtures.scopeWithOrderPlacement },
            email: staticFixtures.customer.email,
            password: staticFixtures.defaultPassword,
            orderLimit: staticFixtures.limits.orderLimitAmount,
            budget: { amount: staticFixtures.limits.budgetAmount, period: staticFixtures.limits.budgetPeriod },
            allowedSellers: [staticFixtures.limits.sellerReference],
            allowedCategories: [staticFixtures.limits.categoryKey],
          });
        });

        userLoginScenario.execute({
          username: staticFixtures.backofficeUser.username,
          password: staticFixtures.backofficeUser.password,
        });
        consentListPage.visit();
        cy.then(() => {
          consentListPage
            .getConstraintsCell(client.clientId)
            .invoke('text')
            .then((constraintsText) => {
              staticFixtures.limits.constraintsColumnTexts.forEach((text) => {
                expect(constraintsText).to.contain(text);
              });
            });
        });
      });
    } else {
      it.skip('skipped until the suite runs AgenticCommerce cut 6b', () => {});
    }

    it('client should lose access once a back office user revokes its consent', (): void => {
      let tokens: AgenticCommerceTokens;

      clientAuthorizationScenario
        .execute({ client, email: staticFixtures.customer.email, password: staticFixtures.defaultPassword })
        .then(({ proofKey, response }) => {
          exchangeAuthorizationCode(client, String(response.code), proofKey).then((tokenResponse) => {
            tokens = tokenResponse.body;
          });
        });

      connectedAppsPage.visit();
      connectedAppsPage.getConnectedApp(client.name).should('be.visible');

      userLoginScenario.execute({
        username: staticFixtures.backofficeUser.username,
        password: staticFixtures.backofficeUser.password,
      });
      consentListPage.visit();
      consentListPage.revoke(client.clientId);
      consentListPage.getFlashMessage().should('contain', 'Consent revoked');

      cy.then(() => {
        readPrincipal(tokens.access_token).its('status').should('equal', 401);
      });
    });
  }
);
