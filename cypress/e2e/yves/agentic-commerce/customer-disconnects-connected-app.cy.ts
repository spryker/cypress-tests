import { ConnectedAppsPage } from '@pages/yves';
import { ClientAuthorizationScenario } from '@scenarios/yves';
import {
  blockAgenticCommerceClient,
  container,
  exchangeAuthorizationCode,
  isAgenticCommerceCutReached,
  readPrincipal,
  refreshTokens,
  registerAgenticCommerceClient,
} from '@utils';
import { AgenticCommerceClient, AgenticCommerceStaticFixtures, AgenticCommerceTokens } from '@interfaces/api';

describe(
  'customer-disconnects-connected-app',
  { tags: ['@yves', '@api', '@agentic-commerce', '@agentic-commerce-cut-1', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('1')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 1', () => {});
      return;
    }

    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);
    const connectedAppsPage = container.get(ConnectedAppsPage);

    let staticFixtures: AgenticCommerceStaticFixtures;
    let client: AgenticCommerceClient;

    before((): void => {
      ({ staticFixtures } = Cypress.env());
      registerAgenticCommerceClient('CustomerDisconnects', staticFixtures.redirectUri, staticFixtures.scope).then(
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

    it('client should lose access once the customer disconnects it', (): void => {
      let tokens: AgenticCommerceTokens;

      clientAuthorizationScenario
        .execute({ client, email: staticFixtures.customer.email, password: staticFixtures.defaultPassword })
        .then(({ proofKey, response }) => {
          exchangeAuthorizationCode(client, String(response.code), proofKey).then((tokenResponse) => {
            tokens = tokenResponse.body;
          });
        });

      connectedAppsPage.visit();
      connectedAppsPage.disconnect(client.name);
      connectedAppsPage.getList().should('not.contain', client.name);

      cy.then(() => {
        readPrincipal(tokens.access_token).its('status').should('equal', 401);
        refreshTokens(client, tokens.refresh_token).then((refreshResponse) => {
          expect(refreshResponse.status).to.equal(400);
          expect(refreshResponse.body).to.have.property('error', 'invalid_grant');
        });
      });
    });
  }
);
