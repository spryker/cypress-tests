import { ConnectedAppsPage, ConsentPage } from '@pages/yves';
import { ClientAuthorizationScenario } from '@scenarios/yves';
import {
  blockAgenticCommerceClient,
  container,
  exchangeAuthorizationCode,
  isAgenticCommerceCutReached,
  registerAgenticCommerceClient,
  setAgenticCommerceScopeCeiling,
} from '@utils';
import { AgenticCommerceClient, AgenticCommerceOrderPlacementStaticFixtures } from '@interfaces/api';

describe(
  'client-places-order-within-authority',
  { tags: ['@api', '@yves', '@agentic-commerce', '@agentic-commerce-cut-4', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('4')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 4', () => {});
      return;
    }

    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);
    const consentPage = container.get(ConsentPage);
    const connectedAppsPage = container.get(ConnectedAppsPage);

    const ORDER_PLACE_SCOPE = 'order:place';

    let staticFixtures: AgenticCommerceOrderPlacementStaticFixtures;
    let client: AgenticCommerceClient;

    before((): void => {
      ({ staticFixtures } = Cypress.env());
      registerAgenticCommerceClient('ClientPlacesOrder', staticFixtures.redirectUri, staticFixtures.scope).then(
        (registeredClient) => {
          client = { ...registeredClient, scope: staticFixtures.scopeWithOrderPlacement };
          setAgenticCommerceScopeCeiling(client, staticFixtures.scopeWithOrderPlacement.split(' '));
        }
      );
    });

    after((): void => {
      if (client) {
        blockAgenticCommerceClient(client);
      }
    });

    it('company user should see the order scope, the optional limit field and the role limit on the consent page', (): void => {
      clientAuthorizationScenario.openConsentPage({
        client,
        email: staticFixtures.buyerWithLimit.email,
        password: staticFixtures.defaultPassword,
      });

      consentPage.getConsentBox().should('contain', staticFixtures.orderPlacementScopeLabel);
      consentPage.getConsentBox().should('contain', staticFixtures.buyerWithLimit.roleLimitHint);
      consentPage.getConsentBox().should('not.contain', staticFixtures.texts.ordersNotPlaced);
      consentPage.getOrderLimitInput().should('exist');
    });

    it('company user should connect the client without a limit and see the order scope on Connected apps', (): void => {
      clientAuthorizationScenario
        .execute({
          client,
          email: staticFixtures.buyerWithLimit.email,
          password: staticFixtures.defaultPassword,
        })
        .then(({ proofKey, response }) => {
          exchangeAuthorizationCode(client, String(response.code), proofKey).then((tokenResponse) => {
            expect(tokenResponse.status).to.equal(200);
            expect(tokenResponse.body.scope.split(' ')).to.include(ORDER_PLACE_SCOPE);
          });
        });

      connectedAppsPage.visit();
      connectedAppsPage.getConnectedApp(client.name).should('contain', staticFixtures.orderPlacementScopeLabel);
      connectedAppsPage.getConnectedApp(client.name).should('not.contain', staticFixtures.texts.maximumPerOrderPrefix);
    });

    it('company user should connect the client with a limit and see the maximum per order on Connected apps', (): void => {
      clientAuthorizationScenario.execute({
        client,
        email: staticFixtures.buyerWithLimit.email,
        password: staticFixtures.defaultPassword,
        orderLimit: staticFixtures.consentLimit.amount,
      });

      connectedAppsPage.visit();
      connectedAppsPage.getConnectedApp(client.name).should('contain', staticFixtures.consentLimit.label);
    });

    const expectConsentRefusedWithLimit = (invalidLimit: string): void => {
      clientAuthorizationScenario.openConsentPage({
        client,
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      consentPage.setScope(ORDER_PLACE_SCOPE, true);
      consentPage.enterOrderLimit(invalidLimit);
      consentPage.allow();

      cy.url().should('include', '/connect/consent');
      consentPage.getConstraintError().should('be.visible');

      connectedAppsPage.visit();
      connectedAppsPage.getConnectedApp(client.name).should('not.exist');
    };

    it('customer should be refused a connection with an empty limit for the order scope', (): void => {
      expectConsentRefusedWithLimit(staticFixtures.invalidConsentLimits[0]);
    });

    it('customer should be refused a connection with a zero limit for the order scope', (): void => {
      expectConsentRefusedWithLimit(staticFixtures.invalidConsentLimits[1]);
    });

    it('customer should connect the client with a limit and see the maximum per order on Connected apps', (): void => {
      clientAuthorizationScenario.execute({
        client,
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        orderLimit: staticFixtures.b2cConsentLimit.amount,
      });

      connectedAppsPage.visit();
      connectedAppsPage.getConnectedApp(client.name).should('contain', staticFixtures.b2cConsentLimit.label);
    });

    it('customer should not be offered the limit field without the order scope', (): void => {
      clientAuthorizationScenario.openConsentPage({
        client,
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      consentPage.getOrderLimitInput().should('exist');

      consentPage.setScope(ORDER_PLACE_SCOPE, false);

      consentPage.getOrderLimitInput().should('not.exist');
    });
  }
);
