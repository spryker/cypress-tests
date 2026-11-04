import { ConnectedAppsPage, ConsentPage } from '@pages/yves';
import { ClientAuthorizationScenario } from '@scenarios/yves';
import {
  addCartItem,
  blockAgenticCommerceClient,
  callMcpTool,
  container,
  deleteCart,
  exchangeAuthorizationCode,
  isAgenticCommerceCutReached,
  McpToolResult,
  registerAgenticCommerceClient,
  setAgenticCommerceScopeCeiling,
} from '@utils';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import {
  AgenticCommerceClient,
  AgenticCommerceOrderPlacementDynamicFixtures,
  AgenticCommerceOrderPlacementStaticFixtures,
} from '@interfaces/api';

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

      consentPage.getOrderLimitInput().should('be.visible');

      consentPage.setScope(ORDER_PLACE_SCOPE, false);

      consentPage.getOrderLimitInput().should('not.be.visible');
    });

    it('customer should connect the client without the order scope and see no maximum per order', (): void => {
      clientAuthorizationScenario.execute({
        client,
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutScope: ORDER_PLACE_SCOPE,
      });

      connectedAppsPage.visit();
      connectedAppsPage.getConnectedApp(client.name).should('be.visible');
      connectedAppsPage.getConnectedApp(client.name).should('not.contain', staticFixtures.texts.maximumPerOrderPrefix);
    });

    describe(
      'client-places-order-within-authority through the MCP place-order tool',
      { tags: ['@agentic-commerce-cut-3b'] },
      (): void => {
        if (!isAgenticCommerceCutReached('3b')) {
          it.skip('skipped until the suite runs AgenticCommerce cut 3b', () => {});
          return;
        }

        const userLoginScenario = container.get(UserLoginScenario);
        const salesIndexPage = container.get(SalesIndexPage);
        const salesDetailPage = container.get(SalesDetailPage);

        const PLACE_ORDER_TOOL = 'place-order';
        const COMPANY_CONTEXT_TOOL = 'get-company-context';
        const BUSINESS_UNIT_ADDRESS_TYPE = 'company-business-unit-addresses';

        let dynamicFixtures: AgenticCommerceOrderPlacementDynamicFixtures;
        let mcpClient: AgenticCommerceClient;
        let buyerAccessToken: string;
        const cartIds: string[] = [];

        before((): void => {
          ({ staticFixtures, dynamicFixtures } = Cypress.env());

          registerAgenticCommerceClient(
            'ClientPlacesOrderThroughMcp',
            staticFixtures.redirectUri,
            staticFixtures.scope
          ).then((registeredClient) => {
            mcpClient = {
              ...registeredClient,
              scope: staticFixtures.mcpOrder.scope,
              resource: `${Cypress.env().glueStorefrontUrl}/mcp`,
            };
            setAgenticCommerceScopeCeiling(mcpClient, staticFixtures.mcpOrder.scope.split(' '));
          });

          cy.getCustomerAccessToken(staticFixtures.buyerWithLimit.email, staticFixtures.defaultPassword).then(
            (token) => {
              buyerAccessToken = token;
            }
          );
        });

        after((): void => {
          cartIds.forEach((cartId) => deleteCart(buyerAccessToken, cartId));

          if (mcpClient) {
            blockAgenticCommerceClient(mcpClient);
          }
        });

        it("company user's client should place an order within the role limit through MCP, shown with the client in the Back Office", (): void => {
          createCartWithProduct(staticFixtures.mcpOrder.quantityWithinConsentLimit).then((cartId) => {
            connectClient().then((clientAccessToken) => {
              placeOrderThroughMcp(clientAccessToken, cartId).then((result) => {
                expect(result.isError, JSON.stringify(result)).to.equal(false);
                expect(result.status).to.equal(201);
                expect(
                  (result.data?.data as { attributes: { orderReference: string } }).attributes.orderReference
                ).to.be.a('string');
              });
            });
          });

          userLoginScenario.execute({
            username: staticFixtures.backofficeUser.username,
            password: staticFixtures.backofficeUser.password,
          });
          salesIndexPage.visit();
          salesIndexPage.view();
          salesDetailPage.getWidget(staticFixtures.mcpOrder.connectedAppTitle).should('contain', mcpClient.name);
        });

        it("company user's client should be refused an order above the consent limit through MCP", (): void => {
          createCartWithProduct(staticFixtures.mcpOrder.quantityAboveConsentLimit).then((cartId) => {
            connectClient(staticFixtures.consentLimit.amount).then((clientAccessToken) => {
              placeOrderThroughMcp(clientAccessToken, cartId).then((result) => {
                expect(result.isError, JSON.stringify(result)).to.equal(true);
                expect(result.error).to.equal(staticFixtures.mcpOrder.limitExceededError);
              });
            });
          });
        });

        function connectClient(orderLimit?: string): Cypress.Chainable<string> {
          return clientAuthorizationScenario
            .execute({
              client: mcpClient,
              email: staticFixtures.buyerWithLimit.email,
              password: staticFixtures.defaultPassword,
              orderLimit,
            })
            .then(({ proofKey, response }) =>
              exchangeAuthorizationCode(mcpClient, String(response.code), proofKey).then((tokenResponse) => {
                expect(tokenResponse.status, JSON.stringify(tokenResponse.body)).to.equal(200);

                return tokenResponse.body.access_token;
              })
            );
        }

        function createCartWithProduct(quantity: number): Cypress.Chainable<string> {
          return cy
            .createCart(buyerAccessToken, {
              name: `MCP order ${Date.now()}`,
              priceMode: staticFixtures.mcpOrder.priceMode,
              currency: staticFixtures.mcpOrder.currency,
              store: staticFixtures.mcpOrder.store,
            })
            .then((cartId: string) => {
              cartIds.push(cartId);
              addCartItem(buyerAccessToken, cartId, {
                data: { type: 'items', attributes: { sku: dynamicFixtures.product.sku, quantity } },
              });

              return cy.wrap(cartId);
            });
        }

        /**
         * Like an agent: reads the company context for a business unit address of the company user, then places the
         * order with it, since a delegated order may only go to a business unit address.
         */
        function placeOrderThroughMcp(clientAccessToken: string, cartUuid: string): Cypress.Chainable<McpToolResult> {
          return callMcpTool(clientAccessToken, COMPANY_CONTEXT_TOOL, {}).then((companyContext) => {
            expect(companyContext.isError, JSON.stringify(companyContext)).to.equal(false);

            const included = (companyContext.data?.included ?? []) as Array<{ type: string; id: string }>;
            const businessUnitAddress = included.find((resource) => resource.type === BUSINESS_UNIT_ADDRESS_TYPE);

            expect(businessUnitAddress, 'a business unit address in the company context').to.not.equal(undefined);

            const address = { idCompanyBusinessUnitAddress: String(businessUnitAddress?.id) };

            return callMcpTool(clientAccessToken, PLACE_ORDER_TOOL, {
              cartUuid,
              billingAddress: address,
              shippingAddress: address,
              shipment: { idShipmentMethod: staticFixtures.mcpOrder.idShipmentMethod },
              payments: [staticFixtures.mcpOrder.payment],
            });
          });
        }
      }
    );
  }
);
