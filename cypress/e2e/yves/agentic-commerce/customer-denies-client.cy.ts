import { ConnectedAppsPage } from '@pages/yves';
import { ClientAuthorizationScenario } from '@scenarios/yves';
import {
  blockAgenticCommerceClient,
  container,
  isAgenticCommerceCutReached,
  registerAgenticCommerceClient,
} from '@utils';
import { AgenticCommerceClient, AgenticCommerceStaticFixtures } from '@interfaces/api';

describe(
  'customer-denies-client',
  { tags: ['@yves', '@agentic-commerce', '@agentic-commerce-cut-1', 'agentic-commerce'] },
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
      registerAgenticCommerceClient('CustomerDenies', staticFixtures.redirectUri, staticFixtures.scope).then(
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

    it('client should get access_denied and no connection when the customer denies', (): void => {
      clientAuthorizationScenario
        .execute({
          client,
          email: staticFixtures.customer.email,
          password: staticFixtures.defaultPassword,
          allow: false,
        })
        .then(({ state, response }) => {
          expect(response.error).to.equal('access_denied');
          expect(response.code).to.equal(null);
          expect(response.state).to.equal(state);
        });

      connectedAppsPage.visit();
      connectedAppsPage.getList().should('not.contain', client.name);
    });
  }
);
