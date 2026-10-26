import { ConnectedAppsPage } from '@pages/yves';
import { ClientAuthorizationScenario } from '@scenarios/yves';
import {
  blockAgenticCommerceClient,
  container,
  disableAgenticCommerce,
  enableAgenticCommerce,
  exchangeAuthorizationCode,
  isAgenticCommerceCutReached,
  readAuthorizationServerMetadata,
  readPrincipal,
  refreshTokens,
  registerAgenticCommerceClient,
  requestAuthorizationStart,
  revokeToken,
} from '@utils';
import { AgenticCommerceClient, AgenticCommerceStaticFixtures, AgenticCommerceTokens } from '@interfaces/api';

const TEMPORARILY_UNAVAILABLE_BODY = {
  error: 'temporarily_unavailable',
  error_description: 'Delegated access is temporarily disabled.',
};
const RETRY_AFTER_SECONDS = '300';

describe(
  'operator-stops-all-clients',
  { tags: ['@api', '@yves', '@agentic-commerce', '@agentic-commerce-cut-5', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('5')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 5', () => {});
      return;
    }

    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);
    const connectedAppsPage = container.get(ConnectedAppsPage);

    let staticFixtures: AgenticCommerceStaticFixtures;
    let client: AgenticCommerceClient;

    const connectCustomer = (): Cypress.Chainable<AgenticCommerceTokens> =>
      clientAuthorizationScenario
        .execute({ client, email: staticFixtures.customer.email, password: staticFixtures.defaultPassword })
        .then(({ proofKey, response }) => exchangeAuthorizationCode(client, String(response.code), proofKey))
        .then((tokenResponse) => tokenResponse.body);

    before((): void => {
      ({ staticFixtures } = Cypress.env());
      registerAgenticCommerceClient('OperatorStops', staticFixtures.redirectUri, staticFixtures.scope).then(
        (registeredClient) => {
          client = registeredClient;
        }
      );
    });

    afterEach((): void => {
      enableAgenticCommerce();
    });

    after((): void => {
      enableAgenticCommerce();

      if (client) {
        blockAgenticCommerceClient(client);
      }
    });

    it('operator should stop every client without losing consents, and enabling should restore them', (): void => {
      connectCustomer().then((tokens) => {
        readPrincipal(tokens.access_token).its('status').should('equal', 200);

        disableAgenticCommerce();

        readPrincipal(tokens.access_token).then((principalResponse) => {
          expect(principalResponse.status).to.equal(503);
          expect(principalResponse.headers['retry-after']).to.equal(RETRY_AFTER_SECONDS);
          expect(principalResponse.body).to.deep.equal(TEMPORARILY_UNAVAILABLE_BODY);
        });
        refreshTokens(client, tokens.refresh_token).then((refreshResponse) => {
          expect(refreshResponse.status).to.equal(503);
          expect(refreshResponse.body).to.deep.equal(TEMPORARILY_UNAVAILABLE_BODY);
        });
        readAuthorizationServerMetadata().its('status').should('equal', 200);
        requestAuthorizationStart(client).its('status').should('equal', 503);

        connectedAppsPage.visit();
        connectedAppsPage.getList().should('contain', client.name);

        enableAgenticCommerce();

        readPrincipal(tokens.access_token).its('status').should('equal', 200);
      });
    });

    it('client should still revoke its refresh token while delegated access is off', (): void => {
      connectCustomer().then((tokens) => {
        disableAgenticCommerce();

        revokeToken(client, tokens.refresh_token).its('status').should('equal', 200);

        enableAgenticCommerce();

        refreshTokens(client, tokens.refresh_token).its('status').should('equal', 400);
      });
    });

    it('customer should still disconnect a client while delegated access is off', (): void => {
      connectCustomer().then((tokens) => {
        disableAgenticCommerce();

        connectedAppsPage.visit();
        connectedAppsPage.disconnect(client.name);
        connectedAppsPage.getList().should('not.contain', client.name);

        enableAgenticCommerce();

        readPrincipal(tokens.access_token).its('status').should('equal', 401);
        refreshTokens(client, tokens.refresh_token).then((refreshResponse) => {
          expect(refreshResponse.status).to.equal(400);
          expect(refreshResponse.body).to.have.property('error', 'invalid_grant');
        });
      });
    });
  }
);
