import { ConnectedAppsPage, ConsentPage } from '@pages/yves';
import { ClientAuthorizationScenario } from '@scenarios/yves';
import {
  blockAgenticCommerceClient,
  container,
  exchangeAuthorizationCode,
  isAgenticCommerceCutReached,
  readPrincipal,
  registerAgenticCommerceClient,
} from '@utils';
import { AgenticCommerceClient, AgenticCommerceStaticFixtures } from '@interfaces/api';

describe(
  'customer-connects-client',
  { tags: ['@yves', '@api', '@agentic-commerce', '@agentic-commerce-cut-1', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('1')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 1', () => {});
      return;
    }

    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);
    const consentPage = container.get(ConsentPage);
    const connectedAppsPage = container.get(ConnectedAppsPage);

    let staticFixtures: AgenticCommerceStaticFixtures;
    let client: AgenticCommerceClient;

    before((): void => {
      ({ staticFixtures } = Cypress.env());
      registerAgenticCommerceClient('CustomerConnects', staticFixtures.redirectUri, staticFixtures.scope).then(
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

    it('customer should see the client on the consent page', (): void => {
      clientAuthorizationScenario.openConsentPage({
        client,
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      consentPage.getConsentBox().should('contain', client.name);
      consentPage.getPrincipalSelect().find('option').should('have.length', 1);
    });

    it('customer should connect the client and the client should act for the customer', (): void => {
      clientAuthorizationScenario
        .execute({ client, email: staticFixtures.customer.email, password: staticFixtures.defaultPassword })
        .then(({ state, proofKey, response }) => {
          expect(response.error).to.equal(null);
          expect(response.state).to.equal(state);
          expect(response.issuer).to.equal(Cypress.env('glueStorefrontUrl'));

          exchangeAuthorizationCode(client, String(response.code), proofKey).then((tokenResponse) => {
            expect(tokenResponse.status).to.equal(200);
            expect(tokenResponse.body.scope).to.equal(staticFixtures.scope);

            readPrincipal(tokenResponse.body.access_token).then((principalResponse) => {
              expect(principalResponse.status).to.equal(200);
              expect(principalResponse.body.data.attributes.clientId).to.equal(client.clientId);
              expect(principalResponse.body.data.attributes.principalType).to.equal('customer');
              expect(principalResponse.body.data.attributes.principalReference).to.equal(
                staticFixtures.customer.customerReference
              );
            });
          });
        });

      connectedAppsPage.visit();
      connectedAppsPage.getConnectedApp(client.name).should('be.visible');
    });
  }
);
