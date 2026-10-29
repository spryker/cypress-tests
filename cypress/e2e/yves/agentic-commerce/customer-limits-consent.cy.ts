import { ConnectedAppsPage, ConsentPage } from '@pages/yves';
import { ClientAuthorizationScenario } from '@scenarios/yves';
import {
  blockAgenticCommerceClient,
  container,
  exchangeAuthorizationCode,
  isAgenticCommerceCutReached,
  refreshTokens,
  registerAgenticCommerceClient,
  setAgenticCommerceScopeCeiling,
} from '@utils';
import {
  AgenticCommerceClient,
  AgenticCommerceCustomerLimitsStaticFixtures,
  AgenticCommerceTokenError,
  AgenticCommerceTokens,
} from '@interfaces/api';

const registerClientWithOrderScope = (
  name: string,
  staticFixtures: AgenticCommerceCustomerLimitsStaticFixtures
): Cypress.Chainable<AgenticCommerceClient> =>
  registerAgenticCommerceClient(name, staticFixtures.redirectUri, 'agentic-commerce:principal-read').then(
    (registeredClient) => {
      const client = { ...registeredClient, scope: staticFixtures.scopeWithOrderPlacement };
      setAgenticCommerceScopeCeiling(client, staticFixtures.scopeWithOrderPlacement.split(' '));

      return cy.wrap(client);
    }
  );

const authorizationDetailsOf = (tokens: AgenticCommerceTokens): Array<Record<string, unknown>> =>
  tokens.authorization_details ?? [];

describe(
  'customer-sets-limits-on-consent',
  { tags: ['@yves', '@api', '@agentic-commerce', '@agentic-commerce-cut-6b', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('6b')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 6b', () => {});
      return;
    }

    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);
    const consentPage = container.get(ConsentPage);
    const connectedAppsPage = container.get(ConnectedAppsPage);

    let staticFixtures: AgenticCommerceCustomerLimitsStaticFixtures;
    let client: AgenticCommerceClient;

    before((): void => {
      ({ staticFixtures } = Cypress.env());
      registerClientWithOrderScope('CustomerSetsLimits', staticFixtures).then((registeredClient) => {
        client = registeredClient;
      });
    });

    after((): void => {
      if (client) {
        blockAgenticCommerceClient(client);
      }
    });

    it('customer should see the maximum per order and three empty, optional limits on the consent page', (): void => {
      clientAuthorizationScenario.openConsentPage({
        client,
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      consentPage.getConsentBox().should('contain', staticFixtures.texts.budgetLabel);
      consentPage.getConsentBox().should('contain', staticFixtures.texts.sellersLabel);
      consentPage.getConsentBox().should('contain', staticFixtures.texts.categoriesLabel);
      consentPage.getOrderLimitInput().should('be.visible');
      consentPage.getBudgetAmountInput().should('have.value', '');
      consentPage.getBudgetPeriodSelect().should('have.value', '');
      staticFixtures.periodLabels.forEach((periodLabel) => {
        consentPage.getBudgetPeriodSelect().should('contain', periodLabel);
      });
      consentPage.getSellerCheckboxes().should('not.be.checked');
      consentPage.getSellerCheckbox(staticFixtures.merchants.spryker.reference).should('exist');
      consentPage.getSellerCheckbox(staticFixtures.merchants.videoKing.reference).should('exist');
      consentPage.getCategoryCheckboxes().should('not.be.checked');
      consentPage.getCategoryCheckbox(staticFixtures.categories.computer.key).should('exist');
      consentPage.getCategoryCheckbox(staticFixtures.categories.notebooks.key).should('exist');
    });

    it('customer should allow access with all four limits and the client should receive them, also after a refresh', (): void => {
      const types = staticFixtures.authorizationDetailsTypes;
      let expectedDetails: Array<Record<string, unknown>>;

      clientAuthorizationScenario
        .execute({
          client,
          email: staticFixtures.customer.email,
          password: staticFixtures.defaultPassword,
          orderLimit: staticFixtures.orderLimit.amount,
          budget: { amount: staticFixtures.budget.amount, period: staticFixtures.budget.period },
          allowedSellers: [staticFixtures.merchants.spryker.reference],
          allowedCategories: [staticFixtures.categories.computer.key],
        })
        .then(({ proofKey, response }) => {
          expect(response.error).to.equal(null);

          exchangeAuthorizationCode(client, String(response.code), proofKey).then((tokenResponse) => {
            expect(tokenResponse.status).to.equal(200);
            expectedDetails = [
              { type: types.orderTotalLimit, amount: 5000, currency: 'EUR' },
              { type: types.orderBudget, amount: 10000, currency: 'EUR', period: staticFixtures.budget.period },
              { type: types.merchantAllowlist, merchantReferences: [staticFixtures.merchants.spryker.reference] },
              { type: types.categoryAllowlist, categoryKeys: [staticFixtures.categories.computer.key] },
            ];
            expect(authorizationDetailsOf(tokenResponse.body)).to.have.deep.members(expectedDetails);

            refreshTokens(client, tokenResponse.body.refresh_token).then((refreshResponse) => {
              expect(refreshResponse.status).to.equal(200);
              expect(authorizationDetailsOf(refreshResponse.body)).to.have.deep.members(expectedDetails);
            });
          });
        });

      connectedAppsPage.visit();
      connectedAppsPage.getConnectedApp(client.name).should('contain', staticFixtures.orderLimit.label);
      connectedAppsPage.getConnectedApp(client.name).should('contain', staticFixtures.budget.connectedAppsLabel);
      connectedAppsPage.getConnectedApp(client.name).should('contain', staticFixtures.texts.sellersLine);
      connectedAppsPage.getConnectedApp(client.name).should('contain', staticFixtures.texts.categoriesLine);
    });
  }
);

describe(
  'customer-tightens-limits-the-client-asked-for',
  { tags: ['@yves', '@api', '@agentic-commerce', '@agentic-commerce-cut-6b', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('6b')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 6b', () => {});
      return;
    }

    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);
    const consentPage = container.get(ConsentPage);
    const connectedAppsPage = container.get(ConnectedAppsPage);

    let staticFixtures: AgenticCommerceCustomerLimitsStaticFixtures;
    let client: AgenticCommerceClient;
    let requestedBudget: string;

    const openConsentPageWithRequestedBudget = (): ReturnType<ClientAuthorizationScenario['openConsentPage']> =>
      clientAuthorizationScenario.openConsentPage({
        client,
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        authorizationDetails: requestedBudget,
      });

    const expectConsentRefusedWith = (message: string): void => {
      consentPage.allow();

      cy.url().should('include', '/connect/consent');
      consentPage.getConstraintError().should('contain', message);

      connectedAppsPage.visit();
      connectedAppsPage.getConnectedApp(client.name).should('not.exist');
    };

    before((): void => {
      ({ staticFixtures } = Cypress.env());
      requestedBudget = JSON.stringify([
        {
          type: staticFixtures.authorizationDetailsTypes.orderBudget,
          amount: staticFixtures.budget.requestedAmount,
          currency: 'EUR',
          period: staticFixtures.budget.period,
        },
      ]);
      registerClientWithOrderScope('CustomerTightens', staticFixtures).then((registeredClient) => {
        client = registeredClient;
      });
    });

    after((): void => {
      if (client) {
        blockAgenticCommerceClient(client);
      }
    });

    it('customer should see the budget the client asked for on the consent page', (): void => {
      openConsentPageWithRequestedBudget();

      consentPage.getBudgetAmountInput().should('have.value', staticFixtures.budget.requestedDisplay);
      consentPage.getBudgetPeriodSelect().should('have.value', staticFixtures.budget.period);
    });

    it('customer should be refused a budget above the one the client asked for', (): void => {
      openConsentPageWithRequestedBudget();
      consentPage.enterOrderLimit(staticFixtures.orderLimit.amount);
      consentPage.enterBudget(staticFixtures.budget.raisedAmount);

      expectConsentRefusedWith(staticFixtures.texts.widerThanRequested);
    });

    it('customer should be refused an emptied budget the client asked for', (): void => {
      openConsentPageWithRequestedBudget();
      consentPage.enterOrderLimit(staticFixtures.orderLimit.amount);
      consentPage.enterBudget('');

      expectConsentRefusedWith(staticFixtures.texts.requestedRemoved);
    });

    it('customer should be able to lower the budget and the client should receive the lowered budget', (): void => {
      openConsentPageWithRequestedBudget().then(({ proofKey }) => {
        consentPage.enterOrderLimit(staticFixtures.orderLimit.amount);
        consentPage.enterBudget(staticFixtures.budget.loweredAmount);

        clientAuthorizationScenario.allowConsentPage().then((response) => {
          expect(response.error).to.equal(null);

          exchangeAuthorizationCode(client, String(response.code), proofKey).then((tokenResponse) => {
            expect(tokenResponse.status).to.equal(200);
            expect(authorizationDetailsOf(tokenResponse.body)).to.deep.include({
              type: staticFixtures.authorizationDetailsTypes.orderBudget,
              amount: 10000,
              currency: 'EUR',
              period: staticFixtures.budget.period,
            });
          });
        });
      });
    });
  }
);

describe(
  'customer-keeps-the-sellers-the-client-asked-for',
  { tags: ['@yves', '@api', '@agentic-commerce', '@agentic-commerce-cut-6b', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('6b')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 6b', () => {});
      return;
    }

    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);
    const consentPage = container.get(ConsentPage);

    let staticFixtures: AgenticCommerceCustomerLimitsStaticFixtures;
    let client: AgenticCommerceClient;

    const requestSellers = (references: string[]): string =>
      JSON.stringify([
        { type: staticFixtures.authorizationDetailsTypes.merchantAllowlist, merchantReferences: references },
      ]);

    before((): void => {
      ({ staticFixtures } = Cypress.env());
      registerClientWithOrderScope('CustomerKeepsSellers', staticFixtures).then((registeredClient) => {
        client = registeredClient;
      });
    });

    after((): void => {
      if (client) {
        blockAgenticCommerceClient(client);
      }
    });

    it('customer should keep only one of two requested sellers and the client should receive that seller only', (): void => {
      const { spryker, videoKing } = staticFixtures.merchants;

      clientAuthorizationScenario
        .openConsentPage({
          client,
          email: staticFixtures.customer.email,
          password: staticFixtures.defaultPassword,
          authorizationDetails: requestSellers([spryker.reference, videoKing.reference]),
        })
        .then(({ proofKey }) => {
          consentPage.getSellerCheckbox(spryker.reference).should('be.checked');
          consentPage.getSellerCheckbox(videoKing.reference).should('be.checked');

          consentPage.enterOrderLimit(staticFixtures.orderLimit.amount);
          consentPage.setSeller(videoKing.reference, false);

          clientAuthorizationScenario.allowConsentPage().then((response) => {
            expect(response.error).to.equal(null);

            exchangeAuthorizationCode(client, String(response.code), proofKey).then((tokenResponse) => {
              expect(tokenResponse.status).to.equal(200);
              expect(authorizationDetailsOf(tokenResponse.body)).to.deep.include({
                type: staticFixtures.authorizationDetailsTypes.merchantAllowlist,
                merchantReferences: [spryker.reference],
              });
            });
          });
        });
    });

    it('customer should not be offered a seller the client did not ask for', (): void => {
      const { spryker, videoKing } = staticFixtures.merchants;

      clientAuthorizationScenario.openConsentPage({
        client,
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        authorizationDetails: requestSellers([spryker.reference]),
      });

      consentPage.getSellerCheckbox(spryker.reference).should('be.checked');
      consentPage.getSellerCheckbox(videoKing.reference).should('not.exist');
    });
  }
);

describe(
  'client-sends-invalid-authorization-details',
  { tags: ['@yves', '@api', '@agentic-commerce', '@agentic-commerce-cut-6b', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('6b')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 6b', () => {});
      return;
    }

    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);
    const consentPage = container.get(ConsentPage);

    let staticFixtures: AgenticCommerceCustomerLimitsStaticFixtures;
    let client: AgenticCommerceClient;

    before((): void => {
      ({ staticFixtures } = Cypress.env());
      registerClientWithOrderScope('ClientSendsInvalid', staticFixtures).then((registeredClient) => {
        client = registeredClient;
      });
    });

    after((): void => {
      if (client) {
        blockAgenticCommerceClient(client);
      }
    });

    it('client should be sent back with invalid_authorization_details for an unknown type, without a consent page', (): void => {
      clientAuthorizationScenario
        .startAuthorization(client, JSON.stringify([{ type: staticFixtures.authorizationDetailsTypes.unknown }]))
        .then(({ state, response }) => {
          expect(response.error).to.equal('invalid_authorization_details');
          expect(response.code).to.equal(null);
          expect(response.state).to.equal(state);
        });

      consentPage.getConsentBox().should('not.exist');
    });

    it('token endpoint should answer 400 when the token request carries authorization_details', (): void => {
      clientAuthorizationScenario
        .execute({
          client,
          email: staticFixtures.customer.email,
          password: staticFixtures.defaultPassword,
          orderLimit: staticFixtures.orderLimit.amount,
        })
        .then(({ proofKey, response }) => {
          expect(response.error).to.equal(null);

          exchangeAuthorizationCode(client, String(response.code), proofKey, {
            authorization_details: JSON.stringify([
              { type: staticFixtures.authorizationDetailsTypes.orderTotalLimit, amount: 1000, currency: 'EUR' },
            ]),
          }).then((tokenResponse) => {
            const body = tokenResponse.body as unknown as AgenticCommerceTokenError;

            expect(tokenResponse.status).to.equal(400);
            expect(body.error).to.equal('invalid_authorization_details');
            expect(body.error_description).to.equal(staticFixtures.texts.tokenEndpointNotSupported);
          });
        });
    });
  }
);
